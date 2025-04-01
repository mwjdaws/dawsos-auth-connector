
import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GraphControlsProps {
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  onResetZoom: () => void;
  isDisabled: boolean;
}

export function GraphControls({
  zoomLevel,
  onZoomChange,
  onResetZoom,
  isDisabled
}: GraphControlsProps) {
  const handleSliderChange = (value: number[]) => {
    onZoomChange(value[0]);
  };
  
  return (
    <div className="absolute bottom-4 right-4 bg-background/90 rounded-lg shadow-md p-2 flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onZoomChange(Math.max(0.5, zoomLevel - 0.25))}
              disabled={isDisabled || zoomLevel <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom out</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="w-24">
        <Slider
          value={[zoomLevel]}
          min={0.5}
          max={2}
          step={0.1}
          onValueChange={handleSliderChange}
          disabled={isDisabled}
        />
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onZoomChange(Math.min(2, zoomLevel + 0.25))}
              disabled={isDisabled || zoomLevel >= 2}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom in</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onResetZoom}
              disabled={isDisabled}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset zoom</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
