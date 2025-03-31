
import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ensureNumber } from '@/utils/validation/compatibility';

interface GraphZoomControlProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
  step?: number;
}

/**
 * GraphZoomControl Component
 * 
 * Provides zoom controls for graph rendering with slider and buttons
 * 
 * @param zoom - Current zoom level
 * @param setZoom - Function to set the zoom level
 * @param minZoom - Minimum zoom level (default: 0.1)
 * @param maxZoom - Maximum zoom level (default: 3)
 * @param step - Step increment for the slider (default: 0.1)
 */
export function GraphZoomControl({
  zoom,
  setZoom,
  minZoom = 0.1,
  maxZoom = 3,
  step = 0.1
}: GraphZoomControlProps) {
  // Ensure zoom is a valid number and constrained
  const safeZoom = ensureNumber(zoom, 1);
  const constrainedZoom = Math.max(minZoom, Math.min(maxZoom, safeZoom));
  
  const handleChange = (value: number[]) => {
    if (value.length > 0 && typeof value[0] === 'number') {
      setZoom(value[0]);
    }
  };

  const zoomIn = () => {
    if (constrainedZoom < maxZoom) {
      setZoom(Math.min(maxZoom, constrainedZoom + step));
    }
  };

  const zoomOut = () => {
    if (constrainedZoom > minZoom) {
      setZoom(Math.max(minZoom, constrainedZoom - step));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={zoomOut}
        disabled={constrainedZoom <= minZoom}
        className="h-7 w-7"
        aria-label="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <div className="w-24">
        <Slider
          value={[constrainedZoom]}
          min={minZoom}
          max={maxZoom}
          step={step}
          onValueChange={handleChange}
          aria-label="Zoom Level"
        />
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={zoomIn}
        disabled={constrainedZoom >= maxZoom}
        className="h-7 w-7"
        aria-label="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <span className="text-xs text-muted-foreground w-14">
        {Math.round(constrainedZoom * 100)}%
      </span>
    </div>
  );
}
