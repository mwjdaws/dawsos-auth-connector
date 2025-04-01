
import React from 'react';
import { GraphRenderer } from './graph-renderer/GraphRenderer';
import { GraphData, GraphRendererRef } from '../types';

interface GraphContentProps {
  graphRef: React.RefObject<GraphRendererRef>;
  graphData: GraphData;
  width: number;
  height: number;
  highlightedNodeId: string | null;
  zoomLevel: number;
  onNodeSelect: (nodeId: string) => void;
}

export function GraphContent({
  graphRef,
  graphData,
  width,
  height,
  highlightedNodeId,
  zoomLevel,
  onNodeSelect
}: GraphContentProps) {
  const handleNodeClick = (nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
  };
  
  const handleLinkClick = (source: string, target: string) => {
    console.log(`Link clicked: ${source} -> ${target}`);
  };
  
  return (
    <div className="w-full h-full">
      <GraphRenderer
        ref={graphRef}
        graphData={graphData}
        width={width}
        height={height}
        highlightedNodeId={highlightedNodeId}
        zoom={zoomLevel}
        onNodeClick={handleNodeClick}
        onLinkClick={handleLinkClick}
      />
    </div>
  );
}
