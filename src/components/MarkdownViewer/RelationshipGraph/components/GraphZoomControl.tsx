
/**
 * GraphZoomControl Component
 * 
 * A reusable component for controlling zoom level in the graph visualization.
 * This component provides a slider for zoom control and buttons for zoom in/out actions.
 */
import React, { memo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface GraphZoomControlProps {
  zoom: number;
  onZoomChange: (value: number) => void;
  onReset: () => void;
  min?: number;
  max?: number;
  step?: number;
}

export const GraphZoomControl = memo(({
  zoom,
  onZoomChange,
  onReset,
  min = 0.5,
  max = 5,
  step = 0.1
}: GraphZoomControlProps) => {
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + step, max);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - step, min);
    onZoomChange(newZoom);
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border shadow-sm">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= min}
        title="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Slider
        value={[zoom]}
        min={min}
        max={max}
        step={step}
        onValueChange={([value]) => onZoomChange(value)}
        className="w-24 md:w-32"
      />
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= max}
        title="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onReset}
        title="Reset zoom"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
});

GraphZoomControl.displayName = 'GraphZoomControl';
