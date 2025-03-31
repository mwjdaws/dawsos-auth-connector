
import React from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ensureNumber, ensureValidZoom } from '../compatibility';

interface GraphZoomControlProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  onResetZoom: () => void;
}

/**
 * GraphZoomControl Component
 * 
 * This component provides zoom controls for the graph visualization,
 * allowing users to zoom in, zoom out, and reset the zoom level.
 */
export function GraphZoomControl({ 
  zoom, 
  setZoom, 
  onResetZoom 
}: GraphZoomControlProps) {
  const safeZoom = ensureValidZoom(zoom);
  
  // Zoom in by 10%
  const handleZoomIn = () => {
    const newZoom = Math.min(2, safeZoom * 1.1);
    setZoom(newZoom);
  };
  
  // Zoom out by 10%
  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, safeZoom * 0.9);
    setZoom(newZoom);
  };
  
  return (
    <div className="flex items-center space-x-2 bg-background/90 p-1 rounded-md shadow-sm border">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomOut}
        aria-label="Zoom out"
        className="h-8 w-8 p-0"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <span className="text-xs font-mono w-12 text-center">
        {Math.round(safeZoom * 100)}%
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomIn}
        aria-label="Zoom in"
        className="h-8 w-8 p-0"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onResetZoom}
        aria-label="Reset zoom"
        className="h-8 w-8 p-0"
      >
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
}
