
import React, { useState, useEffect, useRef } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GraphData, GraphProps, GraphRendererRef } from './types';
import { useRelationshipGraph } from './hooks/useRelationshipGraph';
import { GraphRenderer } from './components/graph-renderer/GraphRenderer';
import { GraphControls } from './components/GraphControls';
import { GraphSearch } from './components/GraphSearch';
import { ensureValidZoom, createSafeGraphProps } from './compatibility';

/**
 * RelationshipGraph Component
 * 
 * Displays a knowledge graph visualization showing connections between content items.
 */
export function RelationshipGraph({ 
  startingNodeId = '',
  width = 800,
  height = 600,
  hasAttemptedRetry = false
}: GraphProps) {
  // Create safe props
  const safeProps = createSafeGraphProps({ startingNodeId, width, height, hasAttemptedRetry });
  
  // Use the relationship graph hook
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
    startingNodeId: safeProps.startingNodeId,
    hasAttemptedRetry: safeProps.hasAttemptedRetry
  });

  // Safe zoom level
  const safeZoomLevel = ensureValidZoom(zoomLevel);
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          {loadingTime > 5 
            ? "Loading knowledge graph... (this may take a minute for large graphs)" 
            : "Loading knowledge graph..."}
        </p>
        {loadingTime > 15 && (
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={handleRetry}
          >
            Refresh Graph
          </Button>
        )}
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-8 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Error Loading Graph</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={handleRetry}>Try Again</Button>
      </div>
    );
  }
  
  // Render empty state
  if (!graphData?.nodes?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-8 text-center">
        <AlertTriangle className="h-8 w-8 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Connections Found</h3>
        <p className="text-muted-foreground mb-4">
          {startingNodeId 
            ? "This content doesn't have any knowledge connections yet." 
            : "No knowledge connections found in the system."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-4 w-full" data-testid="relationship-graph">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <GraphSearch 
          graphData={graphData} 
          onNodeFound={handleNodeFound}
        />
        
        <GraphControls
          zoomLevel={safeZoomLevel}
          onZoomChange={handleZoomChange}
          onResetZoom={handleResetZoom}
          isDisabled={isPending}
        />
      </div>

      <ErrorBoundary fallback={
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          The graph could not be rendered. Please try refreshing the page.
        </div>
      }>
        <div className="relative overflow-hidden rounded-lg bg-card" style={{ width, height }}>
          <GraphRenderer
            ref={graphRendererRef}
            graphData={graphData}
            width={width}
            height={height}
            highlightedNodeId={highlightedNodeId}
            zoom={safeZoomLevel}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default RelationshipGraph;
