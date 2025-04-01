
import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { GraphData, GraphNode, GraphLink, GraphRendererProps, GraphRendererRef } from './GraphRendererTypes';
import { useForceSimulation } from './useForceSimulation';
import { useNodeRenderer } from './useNodeRenderer';
import { useLinkRenderer } from './useLinkRenderer';
import { useZoomPan } from './useZoomPan';
import { sanitizeGraphData } from '@/utils/compatibility';

export const GraphRenderer = forwardRef<GraphRendererRef, GraphRendererProps>(({
  graphData,
  width,
  height,
  highlightedNodeId,
  zoom = 1,
  onNodeClick,
  onLinkClick
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sanitizedData, setSanitizedData] = useState<GraphData>({ nodes: [], links: [] });
  
  // Process the graph data to ensure it has all required properties
  useEffect(() => {
    setSanitizedData(sanitizeGraphData(graphData));
  }, [graphData]);
  
  // Set up the force simulation
  const { simulationNodes, simulationLinks } = useForceSimulation({
    graphData: sanitizedData,
    width,
    height
  });
  
  // Create a safe node click handler that handles undefined callbacks
  const safeNodeClickHandler = (nodeId: string) => {
    if (onNodeClick) onNodeClick(nodeId);
  };
  
  // Create a safe link click handler that handles undefined callbacks
  const safeLinkClickHandler = (source: string, target: string) => {
    if (onLinkClick) onLinkClick(source, target);
  };
  
  // Node and link renderers with safe handlers
  const { renderNodes, hitTest, handleNodeClick, hoveredNodeRef } = useNodeRenderer({
    onNodeClick: safeNodeClickHandler
  });
  
  const { renderLinks, handleLinkClick } = useLinkRenderer({
    onLinkClick: safeLinkClickHandler
  });
  
  // Zoom and pan functionality
  const { canvasRef, transform, initZoom, zoomMethods } = useZoomPan({
    width,
    height,
    initialZoom: zoom
  });
  
  // Expose methods via ref
  useImperativeHandle(ref, () => zoomMethods(simulationNodes), [
    zoomMethods,
    simulationNodes
  ]);
  
  // Initialize zoom behavior
  useEffect(() => {
    initZoom();
  }, [initZoom]);
  
  // Canvas rendering
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Clear canvas
    context.clearRect(0, 0, width, height);
    
    // Render links and nodes
    renderLinks(context, simulationLinks, transform);
    renderNodes(context, simulationNodes, transform, highlightedNodeId);
    
  }, [
    simulationNodes,
    simulationLinks,
    transform,
    width,
    height,
    highlightedNodeId,
    renderLinks,
    renderNodes
  ]);
  
  // Handle mouse interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const hitNode = hitTest(x, y, simulationNodes, transform);
    
    // Update hover state
    if (hitNode !== hoveredNodeRef.current) {
      hoveredNodeRef.current = hitNode;
      
      // Redraw canvas to show hover effect
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, width, height);
        renderLinks(context, simulationLinks, transform);
        renderNodes(context, simulationNodes, transform, highlightedNodeId);
      }
      
      // Update cursor
      canvasRef.current.style.cursor = hitNode ? 'pointer' : 'default';
    }
  };
  
  const handleMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const hitNode = hitTest(x, y, simulationNodes, transform);
    
    if (hitNode) {
      handleNodeClick(hitNode);
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative" 
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute top-0 left-0"
        style={{ width: `${width}px`, height: `${height}px` }}
        onMouseMove={handleMouseMove}
        onClick={handleMouseClick}
      />
    </div>
  );
});

GraphRenderer.displayName = 'GraphRenderer';
