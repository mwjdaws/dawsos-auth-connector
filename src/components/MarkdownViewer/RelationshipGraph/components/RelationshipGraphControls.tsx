
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface RelationshipGraphControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  disabled?: boolean;
}

export function RelationshipGraphControls({
  onZoomIn,
  onZoomOut,
  onResetZoom,
  disabled = false
}: RelationshipGraphControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        disabled={disabled}
        className="h-8 w-8 p-0"
        title="Zoom In"
        aria-label="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        disabled={disabled}
        className="h-8 w-8 p-0"
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onResetZoom}
        disabled={disabled}
        className="h-8 w-8 p-0"
        title="Reset Zoom"
        aria-label="Reset Zoom"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
