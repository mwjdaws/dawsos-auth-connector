
/**
 * ErrorFallback Component
 * 
 * Displays an error message when there's an error rendering the RelationshipGraph.
 * Provides a retry option to attempt reloading the graph.
 */
import React, { memo } from 'react';
import { GraphError } from './GraphError';

interface ErrorFallbackProps {
  onRetry: () => void;
}

export const ErrorFallback = memo(({ onRetry }: ErrorFallbackProps) => (
  <GraphError 
    error="An unexpected error occurred while rendering the graph" 
    onRetry={onRetry} 
  />
));

ErrorFallback.displayName = 'ErrorFallback';
