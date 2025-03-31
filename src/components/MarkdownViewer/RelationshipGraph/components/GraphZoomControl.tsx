
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export interface GraphZoomControlProps {
  zoom: number;
  min?: number;
  max?: number;
  step?: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom?: () => void; // Make this prop optional with undefined
}

/**
 * GraphZoomControl Component
 * 
 * Provides controls for zooming in/out of the graph visualization and resetting the zoom level.
 */
export function GraphZoomControl({
  zoom,
  min = 0.1,
  max = 3,
  step = 0.1,
  onZoomChange,
  onResetZoom // This can be undefined
}: GraphZoomControlProps) {
  // Calculate zoom percentage for display 
  const zoomPercentage = Math.round(zoom * 100);
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    if (value.length > 0) {
      const newZoom = value[0];
      if (typeof newZoom === 'number') {
        onZoomChange(newZoom);
      }
    }
  };
  
  // Handle zoom in button click
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + step, max);
    onZoomChange(newZoom);
  };
  
  // Handle zoom out button click
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - step, min);
    onZoomChange(newZoom);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= min}
        title="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <div className="relative min-w-[100px] w-20">
        <Slider
          value={[zoom]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          aria-label="Zoom level"
        />
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= max}
        title="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      {onResetZoom && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onResetZoom}
          title="Reset zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
      
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {zoomPercentage}%
      </span>
    </div>
  );
}

export default GraphZoomControl;
