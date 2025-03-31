
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface GraphZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onResetZoom: () => void;
  className?: string;
}

/**
 * GraphZoomControl Component
 * 
 * A control panel for zooming in, out, and resetting zoom level for the graph visualization
 */
export function GraphZoomControl({ zoom, onZoomChange, onResetZoom, className = '' }: GraphZoomControlProps) {
  // Normalize zoom for the slider (convert from 0.1-5 range to 0-100)
  const normalizedZoom = Math.max(0, Math.min(100, ((zoom - 0.1) / 4.9) * 100));
  
  // Convert slider value back to zoom level
  const handleSliderChange = (value: number[]) => {
    const sliderValue = value[0];
    const newZoom = 0.1 + (sliderValue / 100) * 4.9;
    onZoomChange(newZoom);
  };
  
  // Zoom in/out with buttons (by 25%)
  const handleZoomIn = () => {
    onZoomChange(Math.min(5, zoom * 1.25));
  };
  
  const handleZoomOut = () => {
    onZoomChange(Math.max(0.1, zoom * 0.8));
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={handleZoomOut}
        size="sm"
        variant="outline"
        className="p-0 h-8 w-8"
      >
        <ZoomOut className="h-4 w-4" />
        <span className="sr-only">Zoom Out</span>
      </Button>
      
      <Slider
        value={[normalizedZoom]}
        min={0}
        max={100}
        step={1}
        onValueChange={handleSliderChange}
        className="w-32 mx-2"
        aria-label="Zoom level"
      />
      
      <Button
        onClick={handleZoomIn}
        size="sm"
        variant="outline"
        className="p-0 h-8 w-8"
      >
        <ZoomIn className="h-4 w-4" />
        <span className="sr-only">Zoom In</span>
      </Button>
      
      <Button
        onClick={onResetZoom}
        size="sm"
        variant="outline"
        className="p-0 h-8 w-8 ml-2"
      >
        <RefreshCw className="h-4 w-4" />
        <span className="sr-only">Reset Zoom</span>
      </Button>
    </div>
  );
}
