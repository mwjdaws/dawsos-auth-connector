
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw 
} from 'lucide-react';
import { GraphZoomControlProps } from './graph-renderer/GraphRendererTypes';

export function GraphZoomControl({ 
  zoom,
  onZoomChange,
  onReset,
  min = 0.1,
  max = 4
}: GraphZoomControlProps) {
  // Convert zoom to percentage for slider (0-100)
  const zoomPercent = ((zoom - min) / (max - min)) * 100;
  
  // Convert percentage back to zoom value
  const handleSliderChange = (value: number[]) => {
    const percent = value[0];
    const newZoom = min + (percent / 100) * (max - min);
    onZoomChange(newZoom);
  };
  
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, max);
    onZoomChange(newZoom);
  };
  
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, min);
    onZoomChange(newZoom);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        title="Zoom out"
        onClick={handleZoomOut}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <div className="w-24 md:w-32">
        <Slider
          value={[zoomPercent]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>
      
      <Button
        variant="outline"
        size="sm"
        title="Zoom in"
        onClick={handleZoomIn}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        title="Reset zoom"
        onClick={onReset}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
