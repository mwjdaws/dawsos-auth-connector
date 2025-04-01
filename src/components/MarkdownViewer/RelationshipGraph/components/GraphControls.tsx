
import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GraphZoomControl } from './GraphZoomControl';
import { GraphControlsProps } from '../types';

/**
 * GraphControls Component
 * 
 * A set of controls for the relationship graph including zoom controls.
 */
export function GraphControls({
  zoomLevel,
  onZoomChange,
  onResetZoom,
  isDisabled
}: GraphControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <GraphZoomControl
        zoom={zoomLevel}
        onZoomChange={onZoomChange}
        onReset={onResetZoom}
        disabled={isDisabled}
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onResetZoom}
        disabled={isDisabled}
        title="Reset graph view"
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
