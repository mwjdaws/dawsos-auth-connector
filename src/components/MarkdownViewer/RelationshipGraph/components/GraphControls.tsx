
/**
 * GraphControls Component
 * 
 * Provides interactive controls for the relationship graph, including:
 * - Search functionality to find and highlight specific nodes
 * - Zoom controls to adjust the graph view
 */
import React from 'react';
import { GraphData } from '../components/graph-renderer/GraphRendererTypes';
import { GraphSearch } from './GraphSearch';
import { GraphZoomControl } from './GraphZoomControl';

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
    <div className="flex flex-col md:flex-row p-2 gap-2 border-b bg-muted/20">
      <div className="flex-1">
        <GraphSearch 
          graphData={graphData}
          onNodeSelect={onNodeFound}
        />
      </div>
      
      <GraphZoomControl 
        zoom={zoom}
        onZoomChange={onZoomChange}
        onReset={onResetZoom}
        min={0.1}
        max={2}
      />
    </div>
  );
}
