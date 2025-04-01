
import { useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { GraphNode } from '../../types';
import { ensureNumber } from '@/utils/compatibility';

interface ZoomPanOptions {
  width?: number;
  height?: number;
  minZoom?: number;
  maxZoom?: number;
}

/**
 * Hook to manage zoom and pan behavior for the graph
 */
export function useZoomPan(
  svgRef: React.RefObject<SVGSVGElement>,
  gRef: React.RefObject<SVGGElement>,
  {
    width = 800,
    height = 600,
    minZoom = 0.1,
    maxZoom = 4
  }: ZoomPanOptions = {}
) {
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const currentTransformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);

  // Initialize zoom behavior
  const initializeZoom = useCallback(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    // Create zoom behavior
    zoomBehaviorRef.current = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', (event: any) => {
        currentTransformRef.current = event.transform;
        g.attr('transform', event.transform);
      });

    // Apply zoom behavior to SVG
    svg.call(zoomBehaviorRef.current);

    return zoomBehaviorRef.current;
  }, [svgRef, gRef, minZoom, maxZoom]);

  // Set zoom level
  const setZoom = useCallback((zoomLevel: number) => {
    if (!svgRef.current || !gRef.current || !zoomBehaviorRef.current) {
      initializeZoom();
    }
    
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    
    const safeZoom = Math.max(minZoom, Math.min(maxZoom, ensureNumber(zoomLevel)));
    
    const svg = d3.select(svgRef.current);
    
    svg.transition()
      .duration(250)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity.scale(safeZoom)
      );
  }, [svgRef, initializeZoom, minZoom, maxZoom]);

  // Zoom in
  const zoomIn = useCallback(() => {
    if (!currentTransformRef.current) return;
    
    const newScale = Math.min(maxZoom, currentTransformRef.current.k * 1.3);
    setZoom(newScale);
  }, [setZoom, maxZoom]);

  // Zoom out
  const zoomOut = useCallback(() => {
    if (!currentTransformRef.current) return;
    
    const newScale = Math.max(minZoom, currentTransformRef.current.k / 1.3);
    setZoom(newScale);
  }, [setZoom, minZoom]);

  // Reset zoom
  const resetZoom = useCallback(() => {
    setZoom(1);
  }, [setZoom]);

  // Center view on a node
  const centerOnNode = useCallback((
    nodeId: string,
    getNodeById: (id: string) => GraphNode | undefined
  ) => {
    if (!svgRef.current || !gRef.current || !zoomBehaviorRef.current) {
      initializeZoom();
    }
    
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    
    const node = getNodeById(nodeId);
    if (!node || node.x === undefined || node.y === undefined) return;
    
    const svg = d3.select(svgRef.current);
    const middleX = width / 2;
    const middleY = height / 2;
    
    svg.transition()
      .duration(500)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity
          .translate(middleX - node.x, middleY - node.y)
          .scale(currentTransformRef.current ? currentTransformRef.current.k : 1)
      );
  }, [svgRef, gRef, initializeZoom, width, height]);

  // Center at specific coordinates
  const centerAt = useCallback((x: number, y: number, duration = 500) => {
    if (!svgRef.current || !gRef.current || !zoomBehaviorRef.current) {
      initializeZoom();
    }
    
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const middleX = width / 2;
    const middleY = height / 2;
    
    svg.transition()
      .duration(duration)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity
          .translate(middleX - x, middleY - y)
          .scale(currentTransformRef.current ? currentTransformRef.current.k : 1)
      );
  }, [svgRef, gRef, initializeZoom, width, height]);

  // Zoom to fit all nodes
  const zoomToFit = useCallback((duration = 500) => {
    if (!svgRef.current || !gRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);
    
    // Get bounding box of all nodes
    const bounds = (g.node() as SVGGElement)?.getBBox();
    
    if (!bounds) return;
    
    const fullWidth = width || svgRef.current.clientWidth;
    const fullHeight = height || svgRef.current.clientHeight;
    
    const widthScale = fullWidth / bounds.width;
    const heightScale = fullHeight / bounds.height;
    const scale = Math.min(widthScale, heightScale) * 0.9;
    const centroidX = bounds.x + bounds.width / 2;
    const centroidY = bounds.y + bounds.height / 2;
    
    if (!zoomBehaviorRef.current) {
      initializeZoom();
    }
    
    if (!zoomBehaviorRef.current) return;
    
    svg.transition()
      .duration(duration)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity
          .translate(fullWidth / 2, fullHeight / 2)
          .scale(scale)
          .translate(-centroidX, -centroidY)
      );
  }, [svgRef, gRef, initializeZoom, width, height]);

  // Initialize zoom on mount
  const initialize = useCallback(() => {
    if (!zoomBehaviorRef.current) {
      initializeZoom();
    }
  }, [initializeZoom]);

  return {
    initialize,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    centerOnNode,
    centerAt,
    zoomToFit,
    currentTransform: currentTransformRef.current
  };
}
