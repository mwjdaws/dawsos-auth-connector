
/**
 * GraphContent Component
 * 
 * Renders the main content of the relationship graph, including the graph renderer
 * and loading indicator when processing updates.
 */
import React from 'react';
import { GraphData } from '../types';
import { GraphRenderer } from './graph-renderer/GraphRenderer';
import { GraphRendererRef } from '../types';
import { createCompatibleGraphRef } from '../compatibility';

interface GraphContentProps {
  graphData: GraphData;
  width: number;
  height: number;
  highlightedNodeId?: string | null;
  zoomLevel: number;
  isPending: boolean;
  graphRendererRef: React.RefObject<GraphRendererRef>;
}

export function GraphContent({
  graphData,
  width,
  height,
  highlightedNodeId,
  zoomLevel,
  isPending,
  graphRendererRef
}: GraphContentProps) {
  // Create a local ref for the modern GraphRenderer
  const modernRef = React.useRef<any>(null);
  
  // Set up a ref forwarding mechanism
  React.useEffect(() => {
    if (graphRendererRef.current && modernRef.current) {
      // Forward the modern ref methods to the legacy ref
      Object.assign(graphRendererRef.current, createCompatibleGraphRef(modernRef.current));
    }
  }, [graphRendererRef]);
  
  // Ensure we have valid data with nodes and links
  const safeGraphData: GraphData = {
    nodes: graphData?.nodes || [],
    links: graphData?.links || []
  };
  
  // Provide a non-null value for highlightedNodeId to satisfy the GraphRenderer prop types
  const safeHighlightedNodeId = highlightedNodeId === undefined ? null : highlightedNodeId;
  
  return (
    <div className="relative w-full h-full">
      <GraphRenderer 
        ref={modernRef}
        graphData={safeGraphData} 
        width={width} 
        height={height}
        highlightedNodeId={safeHighlightedNodeId}
        zoom={zoomLevel}
      />
      
      {isPending && (
        <div className="absolute bottom-4 right-4 bg-primary/70 text-primary-foreground px-3 py-1.5 text-xs rounded-md backdrop-blur-sm shadow-sm">
          Updating view...
        </div>
      )}
    </div>
  );
}
