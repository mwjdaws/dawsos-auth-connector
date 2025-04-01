
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

/**
 * Props for the GraphZoomControl component
 */
export interface GraphZoomControlProps {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onReset: () => void;
  disabled?: boolean;
}

/**
 * GraphZoomControl Component
 * 
 * A set of controls for zooming in and out of the graph.
 */
export function GraphZoomControl({
  zoom,
  onZoomChange,
  onReset,
  disabled = false
}: GraphZoomControlProps) {
  const handleZoomIn = () => {
    const newZoom = Math.min(2, zoom + 0.2);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.2, zoom - 0.2);
    onZoomChange(newZoom);
  };

  const handleSliderChange = (value: number[]) => {
    if (value && value.length > 0) {
      onZoomChange(value[0] || 1); // Default to 1 if undefined
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomOut}
        disabled={disabled || zoom <= 0.2}
        title="Zoom out"
      >
        <Minus className="h-3 w-3" />
      </Button>
      
      <Slider
        className="w-20"
        value={[zoom]}
        min={0.2}
        max={2}
        step={0.1}
        onValueChange={handleSliderChange}
        disabled={disabled}
        aria-label="Zoom level"
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomIn}
        disabled={disabled || zoom >= 2}
        title="Zoom in"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
