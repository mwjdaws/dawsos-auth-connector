
/**
 * RelationshipGraphPanel Component
 * 
 * A container component that renders the RelationshipGraph with additional
 * controls and functionality. This component provides:
 * - A header with title and controls
 * - Zoom functionality
 * - Responsive sizing
 * - Error handling with retry capability
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, RefreshCw } from 'lucide-react';
import { RelationshipGraph } from './RelationshipGraph';
import { GraphZoomControl } from './components/GraphZoomControl';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface RelationshipGraphPanelProps {
  sourceId?: string;
  title?: string;
}

export function RelationshipGraphPanel({ 
  sourceId,
  title = 'Knowledge Graph'
}: RelationshipGraphPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);
  
  // Reset zoom to default
  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);
  
  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    
    // Simulate a refresh by forcing a re-render
    // The actual data refresh is handled in the RelationshipGraph component
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);
  
  // Handle errors gracefully
  const handleError = useCallback(() => {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] p-4">
        <p className="text-destructive mb-4">
          An error occurred while rendering the graph visualization.
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }, [handleRefresh]);
  
  // Calculate container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        // For fullscreen, use viewport dimensions
        if (isFullscreen) {
          setDimensions({
            width: window.innerWidth,
            height: window.innerHeight - 100, // Account for header
          });
        } else {
          // For normal mode, use container dimensions with padding
          const width = containerRef.current.clientWidth - 32; // Account for padding
          const height = Math.max(500, window.innerHeight * 0.6);
          setDimensions({ width, height });
        }
      }
    };
    
    // Update on mount and when dimensions change
    updateDimensions();
    
    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isFullscreen]);
  
  // Set appropriate class names based on fullscreen state
  const containerClassName = isFullscreen
    ? "fixed inset-0 z-50 bg-background p-6"
    : "relative";
    
  const cardClassName = isFullscreen
    ? "h-full"
    : "";
  
  return (
    <div className={containerClassName} ref={containerRef}>
      <Card className={cardClassName}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <div className="flex space-x-2">
            <GraphZoomControl 
              zoom={zoom}
              onZoomChange={setZoom}
              onReset={resetZoom}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh graph data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ErrorBoundary fallback={handleError()}>
            <RelationshipGraph 
              startingNodeId={sourceId} 
              width={dimensions.width}
              height={dimensions.height}
            />
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
