
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw, PanelTop } from 'lucide-react';
import { GraphZoomControl } from './GraphZoomControl';
import { ensureNumber, ensureValidZoom } from '../compatibility';

interface GraphControlsProps {
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  onZoomReset: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function GraphControls({
  zoomLevel = 1,
  onZoomChange,
  onZoomReset,
  onRefresh,
  isLoading = false
}: GraphControlsProps) {
  // Ensure zoom level is a number and within valid range
  const currentZoom = ensureValidZoom(ensureNumber(zoomLevel, 1));
  
  const handleZoomIn = () => {
    onZoomChange(Math.min(currentZoom + 0.25, 5));
  };
  
  const handleZoomOut = () => {
    onZoomChange(Math.max(currentZoom - 0.25, 0.1));
  };
  
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
      <Button
        onClick={onRefresh}
        variant="outline"
        size="sm"
        className="rounded-full w-8 h-8 p-0"
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
      
      <Button
        onClick={handleZoomIn}
        variant="outline"
        size="sm"
        className="rounded-full w-8 h-8 p-0"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <GraphZoomControl 
        value={currentZoom} 
        onChange={onZoomChange} 
      />
      
      <Button
        onClick={handleZoomOut}
        variant="outline"
        size="sm"
        className="rounded-full w-8 h-8 p-0"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Button
        onClick={onZoomReset}
        variant="outline"
        size="sm"
        className="rounded-full w-8 h-8 p-0"
        disabled={currentZoom === 1}
      >
        <PanelTop className="h-4 w-4" />
      </Button>
    </div>
  );
}
