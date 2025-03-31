
/**
 * GraphZoomControl Component
 * 
 * Provides controls for adjusting the zoom level of the graph
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MinusIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import { ensureValidZoom } from '../compatibility';

interface GraphZoomControlProps {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
}

export function GraphZoomControl({
  zoom,
  onZoomChange,
  onResetZoom
}: GraphZoomControlProps) {
  // Ensure zoom is a valid number
  const safeZoom = ensureValidZoom(zoom);
  
  const handleSliderChange = (value: number[]) => {
    if (value && value.length > 0) {
      onZoomChange(value[0]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => onZoomChange(Math.max(0.1, safeZoom - 0.1))}
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      
      <Slider
        value={[safeZoom]}
        min={0.1}
        max={3}
        step={0.1}
        onValueChange={handleSliderChange}
        className="w-24 mx-2"
      />
      
      <Button
        onClick={() => onZoomChange(Math.min(3, safeZoom + 0.1))}
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
      
      <Button
        onClick={onResetZoom}
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 ml-2"
      >
        <RefreshCwIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
