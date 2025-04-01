
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GraphZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onReset: () => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

/**
 * GraphZoomControl Component
 * 
 * Provides zoom controls for the graph visualization with a slider and buttons.
 */
export function GraphZoomControl({
  zoom,
  onZoomChange,
  onReset,
  min = 0.1,
  max = 5,
  step = 0.1,
  disabled = false
}: GraphZoomControlProps) {
  const handleSliderChange = (values: number[]) => {
    // Ensure values[0] is a number - if it's undefined, use current zoom
    const newZoom = typeof values[0] === 'number' ? values[0] : zoom;
    onZoomChange(newZoom);
  };

  const decreaseZoom = () => {
    const newZoom = Math.max(min, zoom - step);
    onZoomChange(newZoom);
  };

  const increaseZoom = () => {
    const newZoom = Math.min(max, zoom + step);
    onZoomChange(newZoom);
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-xs">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={decreaseZoom}
        disabled={disabled || zoom <= min}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      
      <Slider
        value={[zoom]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSliderChange}
        disabled={disabled}
        className="flex-1"
      />
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={increaseZoom}
        disabled={disabled || zoom >= max}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        disabled={disabled}
        className="text-xs ml-2"
      >
        Reset
      </Button>
    </div>
  );
}
