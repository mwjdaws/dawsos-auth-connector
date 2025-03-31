
import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface GraphZoomControlProps {
  zoomLevel: number; // Renamed from zoom to zoomLevel
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
}

/**
 * GraphZoomControl Component
 * 
 * Provides zoom controls for the relationship graph visualization.
 */
export function GraphZoomControl({
  zoomLevel, // Renamed from zoom to zoomLevel
  onZoomChange,
  onResetZoom
}: GraphZoomControlProps) {
  // Zoom in by 10%
  const handleZoomIn = () => {
    onZoomChange(zoomLevel * 1.1);
  };
  
  // Zoom out by 10%
  const handleZoomOut = () => {
    onZoomChange(zoomLevel * 0.9);
  };
  
  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleZoomOut}
        className="h-7 w-7"
      >
        <ZoomOut className="h-4 w-4" />
        <span className="sr-only">Zoom Out</span>
      </Button>
      
      <div className="px-2 text-xs text-muted-foreground">
        {Math.round(zoomLevel * 100)}%
      </div>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleZoomIn}
        className="h-7 w-7"
      >
        <ZoomIn className="h-4 w-4" />
        <span className="sr-only">Zoom In</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onResetZoom}
        className="h-7 w-7 ml-1"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="sr-only">Reset Zoom</span>
      </Button>
    </div>
  );
}

export default GraphZoomControl;
