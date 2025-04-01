
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
  const { startingNodeId = '', width = 800, height = 600, hasAttemptedRetry = false } = safeProps;
  
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
  
  // Determine the content to display based on loading/error state
  const content = useMemo(() => {
    if (loading) {
      return <GraphLoading loadingTime={loadingTime} />;
    }
    
    if (error) {
      return <GraphError error={error} onRetry={handleRetry} />;
    }
    
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
      return <EmptyGraphState startingNodeId={startingNodeId} onRetry={handleRetry} />;
    }
    
    return (
      <GraphContent
        graphRef={graphRendererRef}
        graphData={graphData}
        width={width}
        height={height}
        highlightedNodeId={highlightedNodeId}
        zoomLevel={zoomLevel}
        onNodeSelect={handleNodeFound}
      />
    );
  }, [graphData, loading, error, loadingTime, startingNodeId, width, height, highlightedNodeId, zoomLevel, handleNodeFound, handleRetry]);
  
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="flex flex-col h-full">
        <GraphHeader 
          loading={loading}
          nodeCount={graphStats.nodeCount}
          linkCount={graphStats.linkCount}
          onRetry={handleRetry}
        />
        
        <div className="relative flex-1">
          {content}
          
          <GraphControls
            zoomLevel={zoomLevel}
            onZoomChange={handleZoomChange}
            onResetZoom={handleResetZoom}
            isDisabled={loading || !!error || graphStats.isEmpty}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default RelationshipGraph;
