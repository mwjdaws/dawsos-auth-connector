
import React, { useState, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRelationshipGraph } from "./hooks/useRelationshipGraph";
import { GraphSearch } from "./components/GraphSearch";
import { GraphControls } from "./components/GraphControls";
import { GraphContent } from "./components/GraphContent";
import { ErrorFallback } from "./components/ErrorFallback";

interface RelationshipGraphProps {
  startingNodeId: string;
  width?: number;
  height?: number;
  className?: string;
}

export function RelationshipGraph({
  startingNodeId,
  width: externalWidth,
  height: externalHeight,
  className
}: RelationshipGraphProps) {
  const [hasAttemptedRetry, setHasAttemptedRetry] = useState(false);
  const [containerRef, { width, height }] = useResizeObserver<HTMLDivElement>();
  
  const {
    graphData,
    loading,
    loadingTime,
    error,
    highlightedNodeId,
    zoomLevel,
    graphRendererRef,
    handleNodeFound,
    handleZoomChange,
    handleResetZoom,
    handleRetry
  } = useRelationshipGraph({ 
    startingNodeId,
    hasAttemptedRetry
  });
  
  // If loading takes too long, set the retry flag
  useEffect(() => {
    if (loading && loadingTime > 10 && !hasAttemptedRetry) {
      setHasAttemptedRetry(true);
    }
  }, [loading, loadingTime, hasAttemptedRetry]);
  
  // Calculate dimensions
  const graphWidth = externalWidth || width || 800;
  const graphHeight = externalHeight || height || 500;
  
  // Handle error state
  if (error) {
    return (
      <ErrorFallback 
        error={error}
        onRetry={handleRetry}
      />
    );
  }
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <GraphSearch 
            graphData={graphData}
            onNodeFound={handleNodeFound}
            disabled={loading || Boolean(error)}
          />
          
          <GraphControls
            zoomLevel={zoomLevel}
            onZoomChange={handleZoomChange}
            onResetZoom={handleResetZoom}
            isDisabled={loading || Boolean(error)}
          />
        </div>
        
        <div 
          ref={containerRef}
          className="relative w-full"
          style={{ 
            height: graphHeight,
            minHeight: "400px"
          }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center">
                <Skeleton className="h-[300px] w-[500px] mb-4" />
                <p className="text-sm text-muted-foreground">
                  Loading knowledge graph{loadingTime > 3 ? ` (${loadingTime}s)` : ''}...
                </p>
              </div>
            </div>
          )}
          
          {graphData.nodes.length === 0 && !loading && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No relationships found for this content.
              </AlertDescription>
            </Alert>
          )}
          
          <GraphContent 
            graphRef={graphRendererRef}
            graphData={graphData}
            width={graphWidth}
            height={graphHeight}
            highlightedNodeId={highlightedNodeId}
            zoomLevel={zoomLevel}
            onNodeSelect={handleNodeFound}
          />
        </div>
      </CardContent>
    </Card>
  );
}
