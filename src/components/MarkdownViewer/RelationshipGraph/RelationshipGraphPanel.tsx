
import React, { useState } from 'react';
import { RelationshipGraph } from './RelationshipGraph';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface RelationshipGraphPanelProps {
  sourceId?: string;
  className?: string;
}

export function RelationshipGraphPanel({ sourceId, className }: RelationshipGraphPanelProps) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setDimensions({ width: window.innerWidth - 40, height: window.innerHeight - 120 });
    } else {
      setDimensions({ width: 800, height: 500 });
    }
    setIsFullscreen(!isFullscreen);
  };
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <div className={`bg-background rounded-lg overflow-hidden ${className}`}>
      <div className="p-3 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Knowledge Network Visualization</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            title="Refresh graph data"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </div>
      
      <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50 bg-background shadow-lg rounded-lg p-4' : ''}`}>
        {isFullscreen && (
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute top-2 right-2"
            onClick={toggleFullscreen}
          >
            Exit
          </Button>
        )}
        
        <div className="flex flex-col h-full">
          <RelationshipGraph 
            key={refreshKey}
            startingNodeId={sourceId} 
            width={dimensions.width} 
            height={dimensions.height}
          />
          
          <div className="p-3 flex items-center justify-between border-t">
            <div className="text-sm text-muted-foreground">
              Click on nodes to navigate to sources
            </div>
            <div className="flex items-center gap-2">
              <ZoomOut className="h-4 w-4 text-muted-foreground" />
              <Slider 
                defaultValue={[75]} 
                max={100} 
                step={1} 
                className="w-32"
              />
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
