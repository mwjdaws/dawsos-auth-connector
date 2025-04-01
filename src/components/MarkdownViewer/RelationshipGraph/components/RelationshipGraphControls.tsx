
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RelationshipGraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isDisabled?: boolean;
}

export function RelationshipGraphControls({
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isDisabled = false
}: RelationshipGraphControlsProps) {
  return (
    <div className="flex items-center space-x-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onZoomOut}
              disabled={isDisabled}
              className="h-7 w-7"
            >
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">Zoom Out</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onZoomIn}
              disabled={isDisabled}
              className="h-7 w-7"
            >
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Zoom In</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onResetZoom}
              disabled={isDisabled}
              className="h-7 w-7"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Reset Zoom</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset Zoom</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
