
import React, { useState, useEffect, useRef } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card } from '@/components/ui/card';
import { ensureString } from '@/utils/compatibility';
import { RelationshipGraph } from './RelationshipGraph';

/**
 * Props for the RelationshipGraphPanel component
 */
export interface RelationshipGraphPanelProps {
  contentId?: string;
  sourceId?: string;
  hasAttemptedRetry?: boolean;
}

/**
 * RelationshipGraphPanel
 * 
 * A panel that displays a relationship graph for a specific content item.
 * This component wraps the RelationshipGraph in a Card with proper sizing
 * and error handling.
 */
export function RelationshipGraphPanel({ 
  contentId, 
  sourceId,
  hasAttemptedRetry = false
}: RelationshipGraphPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Determine the starting node ID - use sourceId if available, otherwise contentId
  const startingNodeId = ensureString(sourceId || contentId);
  
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

  if (!contentId && !sourceId) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No content ID provided for relationship graph.
      </Card>
    );
  }
  
  return (
    <div ref={containerRef} className="w-full h-[600px]">
      <ErrorBoundary fallback={
        <Card className="p-4 text-center text-destructive">
          An error occurred while loading the relationship graph.
        </Card>
      }>
        <Card className="overflow-hidden">
          <div className="w-full h-full">
            <RelationshipGraph 
              startingNodeId={startingNodeId}
              width={dimensions.width} 
              height={dimensions.height}
              hasAttemptedRetry={hasAttemptedRetry}
            />
          </div>
        </Card>
      </ErrorBoundary>
    </div>
  );
}
