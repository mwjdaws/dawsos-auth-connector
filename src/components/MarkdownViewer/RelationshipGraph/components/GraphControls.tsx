
import React from 'react';
import { GraphData } from '../types';
import { GraphSearch } from './GraphSearch';
import { GraphZoomControl } from './GraphZoomControl';

interface GraphControlsProps {
  graphData: GraphData;
  onNodeFound: (nodeId: string) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
}

/**
 * GraphControls Component
 * 
 * This component provides control elements for the graph, such as search
 * and zoom controls.
 */
export function GraphControls({
  graphData,
  onNodeFound,
  zoom,
  onZoomChange,
  onResetZoom
}: GraphControlsProps) {
  return (
    <div className="flex justify-between items-center p-3 border-b">
      <div className="flex-1 max-w-md">
        <GraphSearch 
          graphData={graphData}
          onNodeFound={onNodeFound}
        />
      </div>
      
      <div className="ml-auto">
        <GraphZoomControl 
          zoom={zoom} 
          setZoom={onZoomChange} 
          onResetZoom={onResetZoom}
        />
      </div>
    </div>
  );
}
