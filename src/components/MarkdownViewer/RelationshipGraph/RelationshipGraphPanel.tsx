
/**
 * RelationshipGraphPanel Component
 * 
 * A container component that renders the RelationshipGraph with a responsive
 * wrapper. It handles the sizing and responsiveness of the graph visualization.
 */
import React, { useState, useEffect, useRef } from 'react';
import { RelationshipGraph } from './RelationshipGraph';
import { ensureNodeId } from './compatibility';

export interface RelationshipGraphPanelProps {
  sourceId?: string;
  contentId?: string;
  hasAttemptedRetry?: boolean;
}

export function RelationshipGraphPanel({ sourceId, contentId, hasAttemptedRetry = false }: RelationshipGraphPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Determine the starting node ID - use sourceId if available, otherwise contentId
  const startingNodeId = ensureNodeId(sourceId || contentId);
  
  // Update dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(width - 2, 300), // Subtract border and ensure minimum width
          height: Math.max(height, 400) // Ensure minimum height
        });
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Update on resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  return (
    <div ref={containerRef} className="w-full h-[600px]">
      <RelationshipGraph 
        startingNodeId={startingNodeId}
        width={dimensions.width} 
        height={dimensions.height}
        hasAttemptedRetry={hasAttemptedRetry}
      />
    </div>
  );
}
