
/**
 * GraphZoomControl Component
 * 
 * Provides zoom controls for the relationship graph with reset, zoom in, and zoom out buttons.
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface GraphZoomControlProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  currentZoom?: number;
  className?: string;
}

export const GraphZoomControl: React.FC<GraphZoomControlProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  currentZoom = 1,
  className = ''
}) => {
  // Format zoom level as percentage
  const zoomPercentage = `${Math.round((currentZoom || 1) * 100)}%`;
  
  return (
    <div className={`flex items-center bg-card rounded-md shadow-sm ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="p-1.5 h-8"
        title="Reset Zoom"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomOut}
        className="p-1.5 h-8"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <span className="px-1.5 text-xs font-medium">{zoomPercentage}</span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomIn}
        className="p-1.5 h-8"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};
