
/**
 * GraphControls Component
 * 
 * A container for search and zoom controls in the graph.
 */
import React from 'react';
import { GraphSearch } from './GraphSearch';
import { GraphZoomControl } from './GraphZoomControl';
import { GraphData, GraphSearchProps, GraphZoomControlProps } from './graph-renderer/GraphRendererTypes';

interface GraphControlsProps {
  graphData: GraphData;
  onNodeFound: (nodeId: string) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
}

export function GraphControls({ 
  graphData,
  onNodeFound,
  zoom,
  onZoomChange,
  onResetZoom
}: GraphControlsProps) {
  return (
    <div className="px-3 py-2 border-b flex justify-between items-center flex-wrap gap-2">
      <GraphSearch 
        nodes={graphData.nodes}
        onNodeFound={onNodeFound}
      />
      
      <GraphZoomControl 
        zoom={zoom}
        onZoomChange={onZoomChange}
        onReset={onResetZoom}
        min={0.5}
        max={3}
      />
    </div>
  );
}
