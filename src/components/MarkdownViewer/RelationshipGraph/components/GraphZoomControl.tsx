
/**
 * GraphZoomControl Component
 * 
 * Provides zoom controls for the graph visualization, including:
 * - Zoom in/out buttons
 * - Reset zoom button
 * - Zoom level indicator
 */
import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GraphZoomControlProps {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onReset: () => void;
  min: number;
  max: number;
}

export function GraphZoomControl({
  zoom,
  onZoomChange,
  onReset,
  min,
  max
}: GraphZoomControlProps) {
  const [sliderValue, setSliderValue] = useState<number[]>([zoom]);
  
  // Update slider when zoom changes externally
  useEffect(() => {
    setSliderValue([zoom]);
  }, [zoom]);
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    if (value && value.length > 0) {
      const newZoom = value[0];
      setSliderValue([newZoom]);
      onZoomChange(newZoom);
    }
  };
  
  // Format zoom percentage for display
  const formatZoom = (value: number) => `${Math.round(value * 100)}%`;
  
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onZoomChange(Math.max(min, zoom - 0.1))}
            disabled={zoom <= min}
            className="px-2"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom out</TooltipContent>
      </Tooltip>
      
      <div className="hidden md:flex items-center gap-2 w-40">
        <Slider
          value={sliderValue}
          min={min}
          max={max}
          step={0.05}
          onValueChange={handleSliderChange}
          className="w-28"
        />
        <span className="text-xs w-10 text-right">{formatZoom(zoom)}</span>
      </div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onZoomChange(Math.min(max, zoom + 0.1))}
            disabled={zoom >= max}
            className="px-2"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom in</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onReset}
            className="px-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset zoom</TooltipContent>
      </Tooltip>
    </div>
  );
}
