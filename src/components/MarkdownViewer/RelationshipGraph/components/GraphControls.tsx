
/**
 * GraphControls Component
 * 
 * Provides controls for searching, navigating, and adjusting the graph view
 */
import React from 'react';
import { GraphSearch } from './GraphSearch';
import { GraphZoomControl } from './GraphZoomControl';
import { GraphData } from '../types';
import { ensureValidZoom } from '../compatibility';

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
  // Ensure zoom is valid
  const safeZoom = ensureValidZoom(zoom);
  
  return (
    <div className="flex items-center justify-between p-2 border-t border-b bg-muted/20">
      <GraphSearch 
        graphData={graphData} 
        onNodeSelect={onNodeFound} 
      />
      
      <GraphZoomControl 
        zoom={safeZoom} 
        setZoom={onZoomChange} 
        onZoomChange={onZoomChange}
        onResetZoom={onResetZoom}
      />
    </div>
  );
}
