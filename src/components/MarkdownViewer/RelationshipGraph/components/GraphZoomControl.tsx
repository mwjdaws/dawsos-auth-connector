
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface GraphZoomControlProps {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onReset: () => void;
  min: number;
  max: number;
  percent?: number;
}

export function GraphZoomControl({
  zoom,
  onZoomChange,
  onReset,
  min = 0.1,
  max = 2,
  percent = 0
}: GraphZoomControlProps) {
  // Calculate the slider value as a percentage
  const sliderValue = (zoom - min) / (max - min) * 100;
  
  // Format the zoom value for display
  const zoomPercent = Math.round((zoom * 100)) + '%';
  
  return (
    <div className="flex items-center gap-2 p-2 bg-background border rounded-lg shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onZoomChange(Math.max(min, zoom - 0.1))}
        title="Zoom out"
        disabled={zoom <= min}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <div className="flex-1 px-1">
        <Slider
          defaultValue={[sliderValue]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => {
            const zoomValue = min + (value[0] / 100) * (max - min);
            onZoomChange(zoomValue);
          }}
          value={[sliderValue]}
          className="w-24"
        />
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onZoomChange(Math.min(max, zoom + 0.1))}
        title="Zoom in"
        disabled={zoom >= max}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onReset}
        title="Reset zoom"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      
      <span className="text-xs font-medium w-12 text-center">
        {zoomPercent}
      </span>
    </div>
  );
}
