
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card } from '@/components/ui/card';
import { RelationshipGraphPanelProps } from '../types';
import { RelationshipGraph } from '../RelationshipGraph';

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
  width = 800, 
  height = 600,
  hasAttemptedRetry = false
}: RelationshipGraphPanelProps) {
  if (!contentId && !sourceId) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No content ID provided for relationship graph.
      </Card>
    );
  }

  // Determine the ID to use for the starting node
  const startingNodeId = sourceId || contentId;

  return (
    <ErrorBoundary fallback={
      <Card className="p-4 text-center text-destructive">
        An error occurred while loading the relationship graph.
      </Card>
    }>
      <Card className="overflow-hidden">
        <div className="w-full h-full">
          <RelationshipGraph 
            startingNodeId={startingNodeId}
            width={width}
            height={height}
            hasAttemptedRetry={hasAttemptedRetry}
          />
        </div>
      </Card>
    </ErrorBoundary>
  );
}
