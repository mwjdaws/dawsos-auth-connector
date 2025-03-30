
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Home } from 'lucide-react';
import { ensureNumber } from '../compatibility';

interface GraphZoomControlProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  zoom: number | undefined;
  minZoom?: number;
  maxZoom?: number;
}

export function GraphZoomControl({
  onZoomIn,
  onZoomOut,
  onResetZoom,
  zoom,
  minZoom = 0.1,
  maxZoom = 5
}: GraphZoomControlProps) {
  const [zoomPercentage, setZoomPercentage] = useState('100%');
  
  // Update zoom percentage display when zoom level changes
  useEffect(() => {
    const safeZoom = ensureNumber(zoom, 1);
    const percentage = Math.round(safeZoom * 100);
    setZoomPercentage(`${percentage}%`);
  }, [zoom]);

  // Determine if zoom buttons should be disabled
  const isZoomInDisabled = zoom !== undefined && zoom >= maxZoom;
  const isZoomOutDisabled = zoom !== undefined && zoom <= minZoom;

  return (
    <div className="flex items-center bg-background border rounded-md shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onZoomOut}
        disabled={isZoomOutDisabled}
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <div className="px-2 text-xs font-medium text-center min-w-[50px]">
        {zoomPercentage}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onZoomIn}
        disabled={isZoomInDisabled}
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 ml-1 border-l"
        onClick={onResetZoom}
        aria-label="Reset zoom"
      >
        <Home className="h-4 w-4" />
      </Button>
    </div>
  );
}
