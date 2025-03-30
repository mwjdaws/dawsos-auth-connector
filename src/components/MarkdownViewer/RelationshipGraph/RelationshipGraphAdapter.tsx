
/**
 * Relationship Graph Adapter
 * 
 * This adapter component handles prop compatibility between the relationship graph
 * components and their consumers, ensuring type safety.
 */
import React from 'react';
import { RelationshipGraph } from './RelationshipGraph';
import { ensureString } from './compatibility';

interface RelationshipGraphAdapterProps {
  startingNodeId?: string;
  hasAttemptedRetry?: boolean;
  width?: number;
  height?: number;
}

/**
 * Adapter for RelationshipGraph to handle optional/nullable props
 */
export function RelationshipGraphAdapter({
  startingNodeId,
  hasAttemptedRetry = false,
  width = 800,
  height = 600
}: RelationshipGraphAdapterProps) {
  // Convert undefined to empty string instead of directly passing undefined
  const safeNodeId = ensureString(startingNodeId);
  
  return (
    <RelationshipGraph
      startingNodeId={safeNodeId}
      hasAttemptedRetry={hasAttemptedRetry}
      width={width}
      height={height}
    />
  );
}
