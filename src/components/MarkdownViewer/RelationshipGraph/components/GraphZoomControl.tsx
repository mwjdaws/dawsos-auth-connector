
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface GraphZoomControlProps {
  zoom: number;
  onZoomChange: (value: number) => void;
  onReset: () => void;
  min?: number;
  max?: number;
}

export function GraphZoomControl({
  zoom,
  onZoomChange,
  onReset,
  min = 0.1,
  max = 2
}: GraphZoomControlProps) {
  // Ensure zoom has a valid value to prevent undefined values
  const safeZoom = typeof zoom === 'number' ? zoom : 1;
  
  // Handle zoom in button click
  const handleZoomIn = () => {
    const newZoom = Math.min(safeZoom + 0.1, max);
    onZoomChange(newZoom);
  };

  // Handle zoom out button click
  const handleZoomOut = () => {
    const newZoom = Math.max(safeZoom - 0.1, min);
    onZoomChange(newZoom);
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    if (value && value.length > 0) {
      onZoomChange(value[0]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleZoomOut}
        disabled={safeZoom <= min}
        className="h-8 w-8 p-0 rounded-full"
      >
        <ZoomOut className="h-4 w-4" />
        <span className="sr-only">Zoom out</span>
      </Button>
      
      <Slider
        defaultValue={[safeZoom]}
        value={[safeZoom]}
        max={max}
        min={min}
        step={0.05}
        onValueChange={handleSliderChange}
        className="w-28"
      />
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleZoomIn}
        disabled={safeZoom >= max}
        className="h-8 w-8 p-0 rounded-full"
      >
        <ZoomIn className="h-4 w-4" />
        <span className="sr-only">Zoom in</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReset}
        className="h-8 w-8 p-0 rounded-full ml-2"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="sr-only">Reset view</span>
      </Button>
    </div>
  );
}
