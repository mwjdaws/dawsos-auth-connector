
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { formatPercentage } from '@/utils/formatting';

// Ensure zoom value is a valid number and within range
const ensureNumber = (value: any, defaultValue: number = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  return defaultValue;
};

const ensureValidZoom = (zoom: number | undefined, min: number = 0.1, max: number = 5): number => {
  const validZoom = ensureNumber(zoom, 1);
  return Math.min(Math.max(validZoom, min), max);
};

interface GraphZoomControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function GraphZoomControl({
  value = 1,
  onChange,
  min = 0.1,
  max = 5,
  step = 0.1
}: GraphZoomControlProps) {
  // Ensure value is within valid range
  const currentValue = ensureValidZoom(value, min, max);
  
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };
  
  return (
    <div className="flex flex-col items-center bg-background/80 backdrop-blur-sm rounded-lg p-2 text-xs">
      <span className="mb-1 text-muted-foreground">
        {formatPercentage(currentValue)}
      </span>
      <Slider
        value={[currentValue]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleChange}
        orientation="vertical"
        className="h-24"
      />
    </div>
  );
}
