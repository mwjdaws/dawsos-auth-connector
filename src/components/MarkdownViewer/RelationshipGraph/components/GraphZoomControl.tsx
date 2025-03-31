
/**
 * GraphZoomControl Component
 * 
 * Controls for adjusting the zoom level of the graph visualization
 */
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export interface GraphZoomControlProps {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
}

export function GraphZoomControl({ 
  zoom = 1, 
  onZoomChange, 
  onResetZoom 
}: GraphZoomControlProps) {
  const handleSliderChange = (values: number[]) => {
    if (values.length > 0) {
      onZoomChange(values[0]);
    }
  };
  
  return (
    <div className="flex items-center space-x-2 px-2 py-1 bg-background/60 backdrop-blur-sm rounded-lg shadow-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7" 
        onClick={() => onZoomChange(Math.max(0.1, zoom - 0.2))}
        aria-label="Zoom out"
      >
        <ZoomOut size={16} />
      </Button>
      
      <Slider
        value={[zoom]}
        min={0.1}
        max={2}
        step={0.1}
        onValueChange={handleSliderChange}
        className="w-28"
        aria-label="Zoom level"
      />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7" 
        onClick={() => onZoomChange(Math.min(2, zoom + 0.2))}
        aria-label="Zoom in"
      >
        <ZoomIn size={16} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7" 
        onClick={onResetZoom}
        aria-label="Reset zoom"
      >
        <RotateCcw size={16} />
      </Button>
    </div>
  );
}
