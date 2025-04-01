
import { useRef, useState, useCallback, useEffect } from 'react';
import * as d3 from 'd3';
import { GraphNode } from './GraphRendererTypes';

export interface ZoomPanState {
  transform: d3.ZoomTransform;
  width: number;
  height: number;
}

export interface ZoomMethods {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitToContent: () => void;
  centerOnNode: (nodeId: string) => void;
  setZoom: (zoom: number) => void;
}

export function useZoomPan({
  width,
  height,
  initialZoom = 1
}: {
  width: number;
  height: number;
  initialZoom?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<Element, unknown>>();
  const [transform, setTransform] = useState<d3.ZoomTransform>(
    d3.zoomIdentity.scale(initialZoom).translate(width / 2, height / 2)
  );

  // Initialize zoom behavior
  const initZoom = useCallback(() => {
    if (!canvasRef.current) return;

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event: d3.D3ZoomEvent<Element, unknown>) => {
        setTransform(event.transform);
      });

    // Store the zoom behavior reference
    zoomBehaviorRef.current = zoom;

    // Apply zoom behavior to the canvas
    d3.select(canvasRef.current).call(zoom);

    // Set initial transform
    const initialTransform = d3.zoomIdentity
      .scale(initialZoom)
      .translate(width / 2, height / 2);

    d3.select(canvasRef.current).call(zoom.transform, initialTransform);
  }, [width, height, initialZoom]);

  // Reset interactivity when component is unmounted
  useEffect(() => {
    return () => {
      if (canvasRef.current && zoomBehaviorRef.current) {
        d3.select(canvasRef.current).on('.zoom', null);
      }
    };
  }, []);

  // Create methods to control zoom/pan
  const zoomMethods = useCallback(
    (nodes: GraphNode[] = []) => {
      // Helper to ensure we have the required references
      const ensureZoomBehavior = () => {
        if (!canvasRef.current || !zoomBehaviorRef.current) {
          return false;
        }
        return true;
      };

      return {
        zoomIn: () => {
          if (!ensureZoomBehavior()) return;
          const newScale = transform.k * 1.2;
          const newTransform = d3.zoomIdentity
            .scale(newScale)
            .translate(transform.x, transform.y);
          d3.select(canvasRef.current!).call(zoomBehaviorRef.current!.transform, newTransform);
        },

        zoomOut: () => {
          if (!ensureZoomBehavior()) return;
          const newScale = transform.k * 0.8;
          const newTransform = d3.zoomIdentity
            .scale(newScale)
            .translate(transform.x, transform.y);
          d3.select(canvasRef.current!).call(zoomBehaviorRef.current!.transform, newTransform);
        },

        resetZoom: () => {
          if (!ensureZoomBehavior()) return;
          const newTransform = d3.zoomIdentity
            .scale(1)
            .translate(width / 2, height / 2);
          d3.select(canvasRef.current!).call(zoomBehaviorRef.current!.transform, newTransform);
        },

        fitToContent: () => {
          if (!ensureZoomBehavior() || nodes.length === 0) return;

          // Find the bounds of all nodes
          const padding = 50;
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

          nodes.forEach(node => {
            if (node.x !== undefined && node.x < minX) minX = node.x;
            if (node.y !== undefined && node.y < minY) minY = node.y;
            if (node.x !== undefined && node.x > maxX) maxX = node.x;
            if (node.y !== undefined && node.y > maxY) maxY = node.y;
          });

          // Special case for no valid coordinates
          if (minX === Infinity || minY === Infinity) return;

          // Calculate scale and translation to fit all nodes
          const dx = maxX - minX + padding * 2;
          const dy = maxY - minY + padding * 2;
          const scale = Math.min(width / dx, height / dy);
          const x = (width - scale * (minX + maxX)) / 2;
          const y = (height - scale * (minY + maxY)) / 2;

          const newTransform = d3.zoomIdentity
            .scale(scale)
            .translate(x, y);
          d3.select(canvasRef.current!).call(zoomBehaviorRef.current!.transform, newTransform);
        },

        centerOnNode: (nodeId: string) => {
          if (!ensureZoomBehavior()) return;
          
          const node = nodes.find(n => n.id === nodeId);
          if (!node || node.x === undefined || node.y === undefined) return;

          const x = width / 2 - (node.x || 0) * transform.k;
          const y = height / 2 - (node.y || 0) * transform.k;
          const newTransform = d3.zoomIdentity
            .scale(transform.k)
            .translate(x, y);
          d3.select(canvasRef.current!).call(zoomBehaviorRef.current!.transform, newTransform);
        },

        setZoom: (zoom: number) => {
          if (!ensureZoomBehavior()) return;
          const newTransform = d3.zoomIdentity
            .scale(zoom)
            .translate(transform.x, transform.y);
          d3.select(canvasRef.current!).call(zoomBehaviorRef.current!.transform, newTransform);
        }
      };
    },
    [width, height, transform]
  );

  return {
    canvasRef,
    transform,
    initZoom,
    zoomMethods
  };
}
