
/**
 * RelationshipGraph Component
 * 
 * The main component that renders the knowledge graph visualization.
 * This component manages data loading states and renders the appropriate
 * subcomponents based on the current state.
 */
import React, { useMemo, useRef } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GraphData, GraphRendererRef, GraphProps } from './types';
import { GraphHeader } from './components/GraphHeader';
import { GraphLoading } from './components/GraphLoading';
import { GraphError } from './components/GraphError';
import { EmptyGraphState } from './components/EmptyGraphState';
import { GraphControls } from './components/GraphControls';
import { GraphContent } from './components/GraphContent';
import { ErrorFallback } from './components/ErrorFallback';
import { useRelationshipGraph } from './hooks/useRelationshipGraph';
import { createSafeGraphProps } from './compatibility';

// Export the main component
export function RelationshipGraph(props: GraphProps) { 
  // Convert props to safe values using our compatibility layer
  const safeProps = createSafeGraphProps(props);
  const { startingNodeId, width, height, hasAttemptedRetry } = safeProps;
  
  // Create a ref for the graph renderer
  const graphRendererRef = useRef<GraphRendererRef>(null);
  
  // Use the custom hook to manage graph state and behavior
  const {
    graphData,
    loading,
    loadingTime,
    error,
    highlightedNodeId,
    zoomLevel,
    isPending,
    graphStats,
    handleNodeFound,
    handleZoomChange,
    handleResetZoom,
    handleRetry
  } = useRelationshipGraph({
    startingNodeId,
    hasAttemptedRetry
  });
  
  // Memoize header data to prevent unnecessary re-renders
  const headerData = useMemo(() => ({
    nodeCount: graphStats?.nodeCount || 0,
    linkCount: graphStats?.linkCount || 0
  }), [graphStats]);
  
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
        <GraphHeader 
          nodeCount={headerData.nodeCount}
          linkCount={headerData.linkCount}
        />
        
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

export default RelationshipGraph;
