
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface RelationshipGraphControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  isDisabled?: boolean;
}

export function RelationshipGraphControls({
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isDisabled = false
}: RelationshipGraphControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        disabled={isDisabled}
        aria-label="Zoom in"
        className="h-8 w-8 p-0"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        disabled={isDisabled}
        aria-label="Zoom out"
        className="h-8 w-8 p-0"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onResetZoom}
        disabled={isDisabled}
        aria-label="Reset zoom"
        className="h-8 w-8 p-0"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
