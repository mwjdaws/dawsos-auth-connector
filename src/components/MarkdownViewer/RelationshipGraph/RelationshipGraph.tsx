
/**
 * RelationshipGraph Component
 * 
 * The main component that renders the knowledge graph visualization.
 * This component manages data loading states and renders the appropriate
 * subcomponents based on the current state.
 * 
 * Dependencies:
 * - useGraphData hook for fetching the graph data
 * - GraphHeader, GraphRenderer, GraphLoading, and GraphError components
 */
import React, { useCallback, memo } from 'react';
import { useGraphData } from './hooks/useGraphData';
import { GraphHeader } from './components/GraphHeader';
import { GraphRenderer } from './components/GraphRenderer';
import { GraphLoading } from './components/GraphLoading';
import { GraphError } from './components/GraphError';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RelationshipGraphProps } from './types';

// Memoized error fallback component
const ErrorFallback = memo(({ onRetry }: { onRetry: () => void }) => (
  <GraphError 
    error="An unexpected error occurred while rendering the graph" 
    onRetry={onRetry} 
  />
));

// Export the main component
export function RelationshipGraph({ 
  startingNodeId, 
  width = 800, 
  height = 600 
}: RelationshipGraphProps) {
  // Fetch graph data and track loading/error states
  const { graphData, loading, error, fetchGraphData } = useGraphData(startingNodeId);
  
  // Memoized retry handler
  const handleRetry = useCallback(() => {
    fetchGraphData();
  }, [fetchGraphData]);
  
  // Show loading state while fetching data
  if (loading) {
    return <GraphLoading />;
  }
  
  // Show error state if there was a problem fetching data
  if (error) {
    return <GraphError error={error} onRetry={handleRetry} />;
  }
  
  // Render the graph when data is available, wrapped in an error boundary
  return (
    <ErrorBoundary fallback={<ErrorFallback onRetry={handleRetry} />}>
      <div className="border rounded-lg bg-card overflow-hidden">
        <GraphHeader graphData={graphData} />
        <GraphRenderer graphData={graphData} width={width} height={height} />
      </div>
    </ErrorBoundary>
  );
}
