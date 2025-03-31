
import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ensureNumber } from '@/utils/validation/compatibility';

export interface GraphZoomControlProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
  step?: number;
  onZoomChange?: (newZoom: number) => void;
  onResetZoom?: () => void;
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
 * @param onZoomChange - Optional callback for zoom change
 * @param onResetZoom - Optional callback for zoom reset
 */
export function GraphZoomControl({
  zoom,
  setZoom,
  minZoom = 0.1,
  maxZoom = 3,
  step = 0.1,
  onZoomChange,
  onResetZoom
}: GraphZoomControlProps) {
  // Ensure zoom is a valid number and constrained
  const safeZoom = ensureNumber(zoom, 1);
  const constrainedZoom = Math.max(minZoom, Math.min(maxZoom, safeZoom));
  
  const handleChange = (value: number[]) => {
    if (value.length > 0 && typeof value[0] === 'number') {
      setZoom(value[0]);
      if (onZoomChange) {
        onZoomChange(value[0]);
      }
    }
  };

  const zoomIn = () => {
    if (constrainedZoom < maxZoom) {
      const newZoom = Math.min(maxZoom, constrainedZoom + step);
      setZoom(newZoom);
      if (onZoomChange) {
        onZoomChange(newZoom);
      }
    }
  };

  const zoomOut = () => {
    if (constrainedZoom > minZoom) {
      const newZoom = Math.max(minZoom, constrainedZoom - step);
      setZoom(newZoom);
      if (onZoomChange) {
        onZoomChange(newZoom);
      }
    }
  };

  const handleReset = () => {
    setZoom(1);
    if (onResetZoom) {
      onResetZoom();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
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
        size="sm"
        onClick={zoomIn}
        disabled={constrainedZoom >= maxZoom}
        className="h-7 w-7"
        aria-label="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="text-xs ml-1"
        aria-label="Reset Zoom"
      >
        {Math.round(constrainedZoom * 100)}%
      </Button>
    </div>
  );
}
