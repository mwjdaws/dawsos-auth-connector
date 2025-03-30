
/**
 * GraphContent Component
 * 
 * Renders the main content of the relationship graph, including the graph renderer
 * and loading indicator when processing updates.
 */
import React from 'react';
import { GraphData, GraphRendererRef } from '../types';
import { GraphRenderer } from './graph-renderer/GraphRenderer';

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
  return (
    <>
      <GraphRenderer 
        ref={graphRendererRef}
        graphData={graphData} 
        width={width} 
        height={height}
        highlightedNodeId={highlightedNodeId}
        zoom={zoomLevel}
      />
      
      {isPending && (
        <div className="absolute bottom-4 right-4 bg-primary/70 text-white px-2 py-1 text-xs rounded-md backdrop-blur-sm">
          Updating view...
        </div>
      )}
    </>
  );
}
