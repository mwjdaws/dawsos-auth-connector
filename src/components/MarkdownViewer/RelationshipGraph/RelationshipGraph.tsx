
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
import React, { useCallback, memo, useState, useEffect } from 'react';
import { useGraphData } from './hooks/useGraphData';
import { GraphHeader } from './components/GraphHeader';
import { GraphRenderer } from './components/GraphRenderer';
import { GraphLoading } from './components/GraphLoading';
import { GraphError } from './components/GraphError';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RelationshipGraphProps } from './types';
import { toast } from '@/hooks/use-toast';

// Memoized error fallback component
const ErrorFallback = memo(({ onRetry }: { onRetry: () => void }) => (
  <GraphError 
    error="An unexpected error occurred while rendering the graph" 
    onRetry={onRetry} 
  />
));

ErrorFallback.displayName = 'ErrorFallback';

// Export the main component
export function RelationshipGraph({ 
  startingNodeId, 
  width = 800, 
  height = 600,
  hasAttemptedRetry = false
}: RelationshipGraphProps) {
  // Track loading time independently to provide more accurate feedback
  const [loadingTime, setLoadingTime] = useState(0);
  const [isManualRetry, setIsManualRetry] = useState(false);
  
  // Fetch graph data and track loading/error states
  const { graphData, loading, error, fetchGraphData } = useGraphData(startingNodeId);
  
  // Loading timer
  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    } else {
      setLoadingTime(0);
    }
  }, [loading]);
  
  // Notify when data is loaded after a manual retry
  useEffect(() => {
    if (isManualRetry && !loading && !error) {
      toast({
        title: "Graph Refreshed",
        description: "The knowledge graph has been successfully refreshed.",
      });
      setIsManualRetry(false);
    }
  }, [isManualRetry, loading, error]);
  
  // Auto-retry if it's the first load and we've crossed a threshold
  useEffect(() => {
    if (hasAttemptedRetry && loading && loadingTime > 10 && !isManualRetry) {
      console.log("Auto-retrying graph data fetch due to long loading time");
      setIsManualRetry(true);
      fetchGraphData();
    }
  }, [hasAttemptedRetry, loading, loadingTime, fetchGraphData, isManualRetry]);
  
  // Memoized retry handler
  const handleRetry = useCallback(() => {
    console.log("Manual retry requested for graph data");
    setIsManualRetry(true);
    fetchGraphData();
  }, [fetchGraphData]);
  
  // Show loading state while fetching data
  if (loading) {
    return <GraphLoading onManualRetry={handleRetry} loadingTime={loadingTime} />;
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
        <p className="text-sm text-muted-foreground mb-6">
          Try adding some ontology terms or linking to other sources.
        </p>
        <button 
          className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          onClick={handleRetry}
        >
          Refresh Graph Data
        </button>
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
