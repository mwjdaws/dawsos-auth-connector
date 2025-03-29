
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
    console.log("Manual retry requested for graph data");
    fetchGraphData();
  }, [fetchGraphData]);
  
  // Show loading state while fetching data
  if (loading) {
    return <GraphLoading onManualRetry={handleRetry} />;
  }
  
  // Show error state if there was a problem fetching data
  if (error) {
    return <GraphError error={error} onRetry={handleRetry} />;
  }
  
  // Show empty state if no data
  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-muted-foreground mb-4">
          No relationship data available for this knowledge source.
        </p>
        <p className="text-sm text-muted-foreground">
          Try adding some ontology terms or linking to other sources.
        </p>
      </div>
    );
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
