
/**
 * GraphZoomControl Component
 * 
 * Renders a slider for controlling the zoom level of the graph.
 */
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GraphZoomControlProps {
  zoom?: number;
  onZoomChange: (zoom: number) => void;
  onResetZoom: () => void;
  className?: string;
}

export const GraphZoomControl: React.FC<GraphZoomControlProps> = ({
  zoom = 1,
  onZoomChange,
  onResetZoom,
  className = ''
}) => {
  // Ensure zoom is a valid number
  const safeZoom = typeof zoom === 'number' && !isNaN(zoom) ? zoom : 1;
  
  // Handle zoom slider change
  const handleZoomChange = (values: number[]) => {
    const newZoom = values[0];
    if (typeof newZoom === 'number' && !isNaN(newZoom)) {
      onZoomChange(newZoom);
    }
  };
  
  // Handle reset button click
  const handleResetClick = () => {
    onResetZoom();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => onZoomChange(Math.max(0.1, safeZoom - 0.1))}
        title="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Slider
        value={[safeZoom]}
        min={0.1}
        max={2}
        step={0.1}
        onValueChange={handleZoomChange}
        className="w-32"
      />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => onZoomChange(Math.min(2, safeZoom + 0.1))}
        title="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 ml-2" 
        onClick={handleResetClick}
        title="Reset zoom"
      >
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default GraphZoomControl;
