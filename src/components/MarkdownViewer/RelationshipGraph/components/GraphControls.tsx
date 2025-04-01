
import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GraphZoomControl } from './GraphZoomControl';

/**
 * Props for GraphControls component
 */
export interface GraphControlsProps {
  zoomLevel: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
  isDisabled?: boolean;
}

/**
 * GraphControls Component
 * 
 * A set of controls for the relationship graph including zoom controls.
 */
export function GraphControls({
  zoomLevel,
  onZoomChange,
  onResetZoom,
  isDisabled = false
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
