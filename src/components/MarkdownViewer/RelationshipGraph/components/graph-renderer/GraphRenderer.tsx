
import React, { useRef, useImperativeHandle, useState, useEffect, forwardRef } from 'react';
import { GraphData, GraphRendererRef, GraphRendererProps } from '../../types';

/**
 * GraphRenderer Component
 * 
 * A force-directed graph visualization component for displaying relationship data.
 */
export const GraphRenderer = forwardRef<GraphRendererRef, GraphRendererProps>(
  ({ 
    graphData, 
    width, 
    height, 
    zoom = 1, 
    highlightedNodeId, 
    onNodeClick, 
    onLinkClick 
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentZoom, setCurrentZoom] = useState(zoom);
    
    // Set up imperative methods for ref
    useImperativeHandle(ref, () => ({
      zoomIn: () => {
        console.log("Zoom in called");
        setCurrentZoom(prev => Math.min(prev + 0.1, 3));
      },
      zoomOut: () => {
        console.log("Zoom out called");
        setCurrentZoom(prev => Math.max(prev - 0.1, 0.1));
      },
      resetZoom: () => {
        console.log("Reset zoom called");
        setCurrentZoom(1);
      },
      setZoom: (newZoom: number) => {
        console.log(`Set zoom to ${newZoom}`);
        setCurrentZoom(Math.max(0.1, Math.min(newZoom, 3)));
      },
      centerOnNode: (nodeId: string) => {
        console.log(`Center on node: ${nodeId}`);
        // Implement centering logic here
      }
    }));
    
    useEffect(() => {
      setCurrentZoom(zoom);
    }, [zoom]);
    
    // Would normally implement D3 force simulation here
    
    // Simple placeholder rendering
    return (
      <div 
        ref={containerRef} 
        className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 border rounded-md"
        style={{ width, height }}
      >
        <div className="absolute top-2 left-2 bg-white/80 dark:bg-black/80 rounded px-2 py-1 text-xs">
          Zoom: {currentZoom.toFixed(1)}
        </div>
        
        {graphData.nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No data to display</p>
          </div>
        ) : (
          <div className="p-4">
            <p className="mb-2">Graph Data:</p>
            <p className="text-sm">{graphData.nodes.length} nodes, {graphData.links.length} links</p>
            {highlightedNodeId && (
              <p className="text-sm mt-2">Highlighted: {highlightedNodeId}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

GraphRenderer.displayName = 'GraphRenderer';
