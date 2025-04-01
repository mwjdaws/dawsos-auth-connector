
import { useRef, useState, useCallback, useEffect } from 'react';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';
import { GraphNode, GraphRendererRef } from './GraphRendererTypes';

interface UseZoomPanProps {
  width: number;
  height: number;
  initialZoom?: number;
}

export function useZoomPan({ width, height, initialZoom = 1 }: UseZoomPanProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: initialZoom });
  const transformRef = useRef(transform);
  
  // Update transform ref when state changes
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);
  
  // Initialize zoom behavior
  const initZoom = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = select(canvasRef.current);
    
    const zoomBehavior = zoom()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        setTransform(event.transform);
      });
    
    canvas.call(zoomBehavior as any);
    
    // Set initial transform
    canvas.call(
      zoomBehavior.transform as any,
      zoomIdentity.translate(width / 2, height / 2).scale(initialZoom)
    );
  }, [width, height, initialZoom]);
  
  // Public methods for the graph renderer
  const zoomMethods = useCallback((nodes: GraphNode[]): GraphRendererRef => {
    return {
      centerOnNode: (nodeId: string) => {
        if (!canvasRef.current) return;
        
        const node = nodes.find(n => n.id === nodeId);
        if (!node || !node.x || !node.y) return;
        
        const canvas = select(canvasRef.current);
        const zoomBehavior = zoom();
        
        const currentTransform = transformRef.current;
        const targetX = width / 2 - node.x * currentTransform.k;
        const targetY = height / 2 - node.y * currentTransform.k;
        
        canvas.transition().duration(750).call(
          zoomBehavior.transform as any,
          zoomIdentity.translate(targetX, targetY).scale(currentTransform.k)
        );
      },
      
      centerAt: (x: number, y: number, duration = 750) => {
        if (!canvasRef.current) return;
        
        const canvas = select(canvasRef.current);
        const zoomBehavior = zoom();
        
        const currentTransform = transformRef.current;
        const targetX = width / 2 - x * currentTransform.k;
        const targetY = height / 2 - y * currentTransform.k;
        
        canvas.transition().duration(duration).call(
          zoomBehavior.transform as any,
          zoomIdentity.translate(targetX, targetY).scale(currentTransform.k)
        );
      },
      
      zoomToFit: (duration = 750) => {
        if (!canvasRef.current || !nodes.length) return;
        
        const canvas = select(canvasRef.current);
        const zoomBehavior = zoom();
        
        // Calculate bounds
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        nodes.forEach(node => {
          if (!node.x || !node.y) return;
          minX = Math.min(minX, node.x);
          minY = Math.min(minY, node.y);
          maxX = Math.max(maxX, node.x);
          maxY = Math.max(maxY, node.y);
        });
        
        if (minX === Infinity) return; // No valid nodes
        
        const dx = maxX - minX;
        const dy = maxY - minY;
        const x = (minX + maxX) / 2;
        const y = (minY + maxY) / 2;
        
        const scale = 0.8 / Math.max(dx / width, dy / height);
        const translateX = width / 2 - x * scale;
        const translateY = height / 2 - y * scale;
        
        canvas.transition().duration(duration).call(
          zoomBehavior.transform as any,
          zoomIdentity.translate(translateX, translateY).scale(scale)
        );
      },
      
      resetZoom: () => {
        if (!canvasRef.current) return;
        
        const canvas = select(canvasRef.current);
        const zoomBehavior = zoom();
        
        canvas.transition().duration(750).call(
          zoomBehavior.transform as any,
          zoomIdentity.translate(width / 2, height / 2).scale(1)
        );
      },
      
      zoom: (zoomLevel: number, duration = 750) => {
        if (!canvasRef.current) return;
        
        const canvas = select(canvasRef.current);
        const zoomBehavior = zoom();
        
        const currentTransform = transformRef.current;
        // Maintain the center point
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate the point in graph coordinates
        const graphX = (centerX - currentTransform.x) / currentTransform.k;
        const graphY = (centerY - currentTransform.y) / currentTransform.k;
        
        // Calculate new translate to keep the same point centered
        const newX = centerX - graphX * zoomLevel;
        const newY = centerY - graphY * zoomLevel;
        
        canvas.transition().duration(duration).call(
          zoomBehavior.transform as any,
          zoomIdentity.translate(newX, newY).scale(zoomLevel)
        );
      },
      
      setZoom: (zoomLevel: number) => {
        if (!canvasRef.current) return;
        
        const canvas = select(canvasRef.current);
        const zoomBehavior = zoom();
        
        const currentTransform = transformRef.current;
        // Maintain the center point
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate the point in graph coordinates
        const graphX = (centerX - currentTransform.x) / currentTransform.k;
        const graphY = (centerY - currentTransform.y) / currentTransform.k;
        
        // Calculate new translate to keep the same point centered
        const newX = centerX - graphX * zoomLevel;
        const newY = centerY - graphY * zoomLevel;
        
        canvas.call(
          zoomBehavior.transform as any,
          zoomIdentity.translate(newX, newY).scale(zoomLevel)
        );
      },
      
      zoomIn: () => {
        if (!canvasRef.current) return;
        
        const currentTransform = transformRef.current;
        const newZoom = Math.min(currentTransform.k * 1.3, 8);
        
        const canvas = select(canvasRef.current);
        const zoomBehavior = zoom();
        
        // Maintain the center point
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate the point in graph coordinates
        const graphX = (centerX - currentTransform.x) / currentTransform.k;
        const graphY = (centerY - currentTransform.y) / currentTransform.k;
        
        // Calculate new translate to keep the same point centered
        const newX = centerX - graphX * newZoom;
        const newY = centerY - graphY * newZoom;
        
        canvas.transition().duration(300).call(
          zoomBehavior.transform as any,
          zoomIdentity.translate(newX, newY).scale(newZoom)
        );
      },
      
      zoomOut: () => {
        if (!canvasRef.current) return;
        
        const currentTransform = transformRef.current;
        const newZoom = Math.max(currentTransform.k / 1.3, 0.1);
        
        const canvas = select(canvasRef.current);
        const zoomBehavior = zoom();
        
        // Maintain the center point
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate the point in graph coordinates
        const graphX = (centerX - currentTransform.x) / currentTransform.k;
        const graphY = (centerY - currentTransform.y) / currentTransform.k;
        
        // Calculate new translate to keep the same point centered
        const newX = centerX - graphX * newZoom;
        const newY = centerY - graphY * newZoom;
        
        canvas.transition().duration(300).call(
          zoomBehavior.transform as any,
          zoomIdentity.translate(newX, newY).scale(newZoom)
        );
      },
      
      getGraphData: () => ({
        nodes: [],
        links: []
      })
    };
  }, [width, height]);
  
  return {
    canvasRef,
    transform,
    initZoom,
    zoomMethods
  };
}
