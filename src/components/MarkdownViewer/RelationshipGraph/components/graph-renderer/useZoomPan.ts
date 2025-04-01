
import { useRef, useCallback, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { GraphData } from '../../types';

interface UseZoomPanProps {
  svgRef: React.RefObject<SVGSVGElement>;
  width: number;
  height: number;
  padding?: number;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  onZoomChange?: (zoom: number) => void;
}

interface ZoomState {
  zoom: number;
  translateX: number;
  translateY: number;
}

/**
 * Custom hook for zoom and pan functionality in the graph
 */
export function useZoomPan({
  svgRef,
  width,
  height,
  padding = 50,
  initialZoom = 1,
  minZoom = 0.1,
  maxZoom = 4,
  onZoomChange
}: UseZoomPanProps) {
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();
  const [zoomState, setZoomState] = useState<ZoomState>({
    zoom: initialZoom,
    translateX: 0,
    translateY: 0
  });

  // Initialize zoom behavior
  const initZoom = useCallback(() => {
    if (!svgRef.current) return;

    // Clear any existing zoom behavior
    d3.select(svgRef.current).on('.zoom', null);

    // Create new zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        const { k, x, y } = event.transform;
        setZoomState({ zoom: k, translateX: x, translateY: y });
        onZoomChange?.(k);
      });

    // Store zoom behavior reference
    zoomBehaviorRef.current = zoomBehavior;

    // Apply zoom behavior to SVG
    d3.select(svgRef.current)
      .call(zoomBehavior)
      .on('dblclick.zoom', null); // Disable double-click zoom
  }, [svgRef, minZoom, maxZoom, onZoomChange]);

  // Set zoom to a specific level
  const setZoom = useCallback((zoomLevel: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;

    const svg = d3.select(svgRef.current);
    const zoomLevel2 = Math.max(minZoom, Math.min(maxZoom, zoomLevel));

    svg.transition()
      .duration(300)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity
          .translate(zoomState.translateX, zoomState.translateY)
          .scale(zoomLevel2)
      );
  }, [svgRef, minZoom, maxZoom, zoomState.translateX, zoomState.translateY]);

  // Center the view on the entire graph
  const zoomToFit = useCallback((graphData: GraphData, duration = 300) => {
    if (!svgRef.current || !zoomBehaviorRef.current || !graphData.nodes.length) return;

    const svg = d3.select(svgRef.current);

    try {
      // Find bounds of all nodes
      const bounds = {
        minX: Math.min(...graphData.nodes.map(node => node.x || 0)) - padding,
        maxX: Math.max(...graphData.nodes.map(node => node.x || width)) + padding,
        minY: Math.min(...graphData.nodes.map(node => node.y || 0)) - padding,
        maxY: Math.max(...graphData.nodes.map(node => node.y || height)) + padding
      };

      const graphWidth = bounds.maxX - bounds.minX;
      const graphHeight = bounds.maxY - bounds.minY;

      if (graphWidth <= 0 || graphHeight <= 0) return;

      // Calculate scale to fit entire graph
      const scale = Math.min(
        width / graphWidth,
        height / graphHeight,
        maxZoom
      );

      // Calculate translation to center the graph
      const translateX = width / 2 - scale * (bounds.minX + bounds.maxX) / 2;
      const translateY = height / 2 - scale * (bounds.minY + bounds.maxY) / 2;

      // Apply transform
      svg.transition()
        .duration(duration)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity
            .translate(translateX, translateY)
            .scale(scale)
        );
    } catch (error) {
      console.error('Error in zoomToFit:', error);
    }
  }, [svgRef, width, height, padding, maxZoom]);

  // Center the view on a specific node
  const centerOnNode = useCallback((nodeId: string, graphData: GraphData, duration = 300) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;

    const node = graphData.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const svg = d3.select(svgRef.current);
    const k = zoomState.zoom;  // Preserve current zoom level

    const centerX = width / 2;
    const centerY = height / 2;
    const nodeX = node.x || 0;
    const nodeY = node.y || 0;

    svg.transition()
      .duration(duration)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity
          .translate(centerX - nodeX * k, centerY - nodeY * k)
          .scale(k)
      );
  }, [svgRef, width, height, zoomState.zoom]);

  // Initialize zoom behavior when component mounts
  useEffect(() => {
    initZoom();
    return () => {
      // Cleanup zoom behavior
      if (svgRef.current) {
        d3.select(svgRef.current).on('.zoom', null);
      }
    };
  }, [initZoom]);

  // Reset zoom when dimensions change
  useEffect(() => {
    if (zoomBehaviorRef.current && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.call(zoomBehaviorRef.current.transform, d3.zoomIdentity.scale(initialZoom));
    }
  }, [width, height, initialZoom]);

  return {
    zoom: zoomState.zoom,
    translateX: zoomState.translateX,
    translateY: zoomState.translateY,
    setZoom,
    zoomToFit,
    centerOnNode
  };
}
