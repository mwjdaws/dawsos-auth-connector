
import { useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { GraphNode } from './GraphRendererTypes';

interface UseZoomPanProps {
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
 * Custom hook for zoom and pan functionality in the graph visualization
 */
export function useZoomPan({
  width,
  height,
  padding = 50,
  initialZoom = 1,
  minZoom = 0.1,
  maxZoom = 4,
  onZoomChange
}: UseZoomPanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<HTMLCanvasElement, unknown>>();
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity.scale(initialZoom));
  const [zoomState, setZoomState] = useState<ZoomState>({
    zoom: initialZoom,
    translateX: 0,
    translateY: 0
  });

  // Initialize zoom behavior
  const initZoom = useCallback(() => {
    if (!canvasRef.current) return;

    // Clear any existing zoom behavior
    d3.select(canvasRef.current).on('.zoom', null as any);

    // Create new zoom behavior
    const zoomBehavior = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', (event: d3.D3ZoomEvent<HTMLCanvasElement, unknown>) => {
        setTransform(event.transform);
        setZoomState({
          zoom: event.transform.k,
          translateX: event.transform.x,
          translateY: event.transform.y
        });
        if (onZoomChange) {
          onZoomChange(event.transform.k);
        }
      });

    // Disable double-click zoom
    zoomBehavior.filter(event => !(event.type === 'dblclick'));

    // Store zoom behavior reference
    zoomBehaviorRef.current = zoomBehavior;

    // Apply zoom behavior to canvas
    d3.select(canvasRef.current)
      .call(zoomBehavior)
      .call(zoomBehavior.transform, d3.zoomIdentity.scale(initialZoom));
  }, [initialZoom, maxZoom, minZoom, onZoomChange]);

  // Helper functions for external zoom control
  const zoomMethods = (nodes: GraphNode[]) => ({
    // Set zoom to a specific level
    setZoom: (zoomLevel: number) => {
      if (!canvasRef.current || !zoomBehaviorRef.current) return;
      
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel));
      
      d3.select(canvasRef.current)
        .transition()
        .duration(300)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity
            .translate(zoomState.translateX, zoomState.translateY)
            .scale(clampedZoom)
        );
    },
    
    // Zoom in by a factor
    zoomIn: () => {
      if (!canvasRef.current || !zoomBehaviorRef.current) return;
      
      const newZoom = Math.min(zoomState.zoom * 1.2, maxZoom);
      
      d3.select(canvasRef.current)
        .transition()
        .duration(300)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity
            .translate(zoomState.translateX, zoomState.translateY)
            .scale(newZoom)
        );
    },
    
    // Zoom out by a factor
    zoomOut: () => {
      if (!canvasRef.current || !zoomBehaviorRef.current) return;
      
      const newZoom = Math.max(zoomState.zoom / 1.2, minZoom);
      
      d3.select(canvasRef.current)
        .transition()
        .duration(300)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity
            .translate(zoomState.translateX, zoomState.translateY)
            .scale(newZoom)
        );
    },
    
    // Reset zoom to initial level
    resetZoom: () => {
      if (!canvasRef.current || !zoomBehaviorRef.current) return;
      
      d3.select(canvasRef.current)
        .transition()
        .duration(300)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity.scale(initialZoom)
        );
    },
    
    // Center the view on a specific node
    centerOnNode: (nodeId: string) => {
      if (!canvasRef.current || !zoomBehaviorRef.current) return;
      
      const node = nodes.find(n => n.id === nodeId);
      if (!node || node.x === undefined || node.y === undefined) return;
      
      const scale = zoomState.zoom;
      const tx = width / 2 - (node.x * scale);
      const ty = height / 2 - (node.y * scale);
      
      d3.select(canvasRef.current)
        .transition()
        .duration(300)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity
            .translate(tx, ty)
            .scale(scale)
        );
    },
    
    // Fit all content in view
    fitToContent: () => {
      if (!canvasRef.current || !zoomBehaviorRef.current || nodes.length === 0) return;
      
      // Filter out nodes with undefined positions
      const validNodes = nodes.filter(node => 
        node.x !== undefined && node.y !== undefined
      );
      
      if (validNodes.length === 0) return;
      
      // Find bounds of all nodes
      const xValues = validNodes.map(node => node.x as number);
      const yValues = validNodes.map(node => node.y as number);
      
      const minX = Math.min(...xValues) - padding;
      const maxX = Math.max(...xValues) + padding;
      const minY = Math.min(...yValues) - padding;
      const maxY = Math.max(...yValues) + padding;
      
      const graphWidth = maxX - minX;
      const graphHeight = maxY - minY;
      
      if (graphWidth <= 0 || graphHeight <= 0) return;
      
      // Calculate scale to fit entire graph
      const scale = Math.min(
        width / graphWidth,
        height / graphHeight,
        maxZoom
      );
      
      // Calculate translation to center the graph
      const tx = width / 2 - ((minX + maxX) / 2) * scale;
      const ty = height / 2 - ((minY + maxY) / 2) * scale;
      
      d3.select(canvasRef.current)
        .transition()
        .duration(300)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity
            .translate(tx, ty)
            .scale(scale)
        );
    }
  });

  // Disable double-clicks to prevent default browser zoom
  const handleDoubleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
  }, []);

  // Add double-click handler to canvas
  const setupEventHandlers = useCallback(() => {
    if (!canvasRef.current) return;
    
    canvasRef.current.addEventListener('dblclick', handleDoubleClick);
    
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('dblclick', handleDoubleClick);
      }
    };
  }, [handleDoubleClick]);

  return {
    canvasRef,
    transform,
    zoomState,
    initZoom,
    setupEventHandlers,
    zoomMethods
  };
}
