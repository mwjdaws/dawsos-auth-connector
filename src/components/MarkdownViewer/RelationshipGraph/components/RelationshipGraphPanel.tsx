
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
  width = 800, 
  height = 600 
}: RelationshipGraphPanelProps) {
  if (!contentId) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No content ID provided for relationship graph.
      </Card>
    );
  }

  return (
    <ErrorBoundary fallback={
      <Card className="p-4 text-center text-destructive">
        An error occurred while loading the relationship graph.
      </Card>
    }>
      <Card className="overflow-hidden">
        <div className="w-full h-full">
          <RelationshipGraph 
            startingNodeId={contentId}
            width={width}
            height={height}
            hasAttemptedRetry={false}
          />
        </div>
      </Card>
    </ErrorBoundary>
  );
}
