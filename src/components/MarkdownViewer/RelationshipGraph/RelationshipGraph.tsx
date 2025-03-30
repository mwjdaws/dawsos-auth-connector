
/**
 * RelationshipGraph Component
 * 
 * The main component that renders the knowledge graph visualization.
 * This component manages data loading states and renders the appropriate
 * subcomponents based on the current state.
 */
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GraphHeader } from './components/GraphHeader';
import { GraphLoading } from './components/GraphLoading';
import { GraphError } from './components/GraphError';
import { EmptyGraphState } from './components/EmptyGraphState';
import { GraphControls } from './components/GraphControls';
import { GraphContent } from './components/GraphContent';
import { ErrorFallback } from './components/ErrorFallback';
import { useRelationshipGraph } from './hooks/useRelationshipGraph';
import { RelationshipGraphProps } from './types';

// Export the main component
export function RelationshipGraph({ 
  startingNodeId, 
  width = 800, 
  height = 600,
  hasAttemptedRetry = false
}: RelationshipGraphProps) {
  // Use the custom hook to manage graph state and behavior
  const {
    graphData,
    loading,
    loadingTime,
    error,
    highlightedNodeId,
    zoomLevel,
    isPending,
    graphRendererRef,
    handleNodeFound,
    handleZoomChange,
    handleResetZoom,
    handleRetry
  } = useRelationshipGraph({
    startingNodeId,
    hasAttemptedRetry
  });
  
  // Show loading state while fetching data
  if (loading) {
    return <GraphLoading onManualRetry={handleRetry} loadingTime={loadingTime} />;
  }
  
  // Show error state if there was a problem fetching data
  if (error) {
    console.error("Graph error:", error);
    return <GraphError error={error} onRetry={handleRetry} />;
  }
  
  // Show empty state if no data
  if (!graphData || graphData.nodes.length === 0) {
    console.log("No graph data available. graphData:", graphData);
    return <EmptyGraphState onRefresh={handleRetry} />;
  }
  
  // Render the graph when data is available, wrapped in an error boundary
  return (
    <ErrorBoundary fallback={<ErrorFallback onRetry={handleRetry} />}>
      <div className="border rounded-lg bg-card overflow-hidden flex flex-col">
        <GraphHeader graphData={graphData} />
        
        <GraphControls
          graphData={graphData}
          onNodeFound={handleNodeFound}
          zoom={zoomLevel}
          onZoomChange={handleZoomChange}
          onResetZoom={handleResetZoom}
        />
        
        <GraphContent
          graphData={graphData}
          width={width}
          height={height}
          highlightedNodeId={highlightedNodeId}
          zoomLevel={zoomLevel}
          isPending={isPending}
          graphRendererRef={graphRendererRef}
        />
      </div>
    </ErrorBoundary>
  );
}
