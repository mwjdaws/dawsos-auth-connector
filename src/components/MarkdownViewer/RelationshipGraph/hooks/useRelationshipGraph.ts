
/**
 * useRelationshipGraph Hook
 * 
 * Custom hook that manages the state and behavior of the relationship graph,
 * including loading, error handling, highlighting, and zoom.
 * 
 * Performance optimizations:
 * - Proper memoization of handlers
 * - Optimized state updates for better performance
 * - Improved loading feedback
 */
import { useState, useCallback, useRef, useEffect, useTransition, useMemo } from 'react';
import { useGraphData } from './graph-data';
import { GraphData, GraphRendererRef } from '../types';
import { toast } from '@/hooks/use-toast';

export interface UseRelationshipGraphProps {
  startingNodeId: string;
  hasAttemptedRetry?: boolean;
}

export function useRelationshipGraph({ 
  startingNodeId = '', 
  hasAttemptedRetry = false 
}: UseRelationshipGraphProps) {
  // Track loading time independently to provide more accurate feedback
  const [loadingTime, setLoadingTime] = useState(0);
  const [isManualRetry, setIsManualRetry] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPending, startTransition] = useTransition();
  const graphRendererRef = useRef<GraphRendererRef>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Log the startingNodeId to help debug
  useEffect(() => {
    console.log(`RelationshipGraph initialized with startingNodeId: ${startingNodeId || 'none'}`);
  }, [startingNodeId]);
  
  // Fetch graph data and track loading/error states
  const { graphData, loading, error, fetchGraphData } = useGraphData(startingNodeId);
  
  // Memoize basic graph stats for logging and performance
  const graphStats = useMemo(() => {
    if (!graphData) return { nodeCount: 0, linkCount: 0, isEmpty: true };
    
    return {
      nodeCount: graphData.nodes.length,
      linkCount: graphData.links.length,
      isEmpty: graphData.nodes.length === 0,
      nodeTypes: graphData.nodes.reduce((acc, node) => {
        const type = (node.type as string) || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [graphData]);
  
  // Log every time graphData changes
  useEffect(() => {
    if (graphData) {
      console.log(`Graph data updated: ${graphStats.nodeCount} nodes, ${graphStats.linkCount} links`);
      
      if (graphStats.isEmpty) {
        console.log('No nodes found in graph data. This might be a data fetching issue.');
      } else {
        // Log node types distribution for debugging
        console.log('Node type distribution:', graphStats.nodeTypes);
        console.log('First few nodes:', graphData.nodes.slice(0, 3));
        console.log('First few links:', graphData.links.slice(0, 3));
      }
    }
  }, [graphData, graphStats]);
  
  // Loading timer with cleanup
  useEffect(() => {
    if (loading) {
      // Clear any existing timer
      if (loadingTimerRef.current) {
        clearInterval(loadingTimerRef.current);
      }
      
      // Start new timer
      loadingTimerRef.current = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
      
      return () => {
        if (loadingTimerRef.current) {
          clearInterval(loadingTimerRef.current);
          loadingTimerRef.current = null;
        }
      };
    } else {
      // Reset timer and clear interval when loading completes
      setLoadingTime(0);
      if (loadingTimerRef.current) {
        clearInterval(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
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
  
  // Handle node found from search - memoized for performance
  const handleNodeFound = useCallback((nodeId: string) => {
    setHighlightedNodeId(nodeId);
    
    // If we have a reference to the graph renderer, center the view on the node
    if (graphRendererRef.current) {
      try {
        const node = graphData?.nodes.find(n => n.id === nodeId);
        if (node) {
          // Use the correct method from GraphRendererRef
          graphRendererRef.current.centerOn(nodeId);
          console.log(`Centering on node: ${node.name || node.title} (${nodeId})`);
        }
      } catch (err) {
        console.error("Error centering on node:", err);
      }
    }
  }, [graphData]);

  // Handle zoom change - wrapped in transition for smoother UI
  const handleZoomChange = useCallback((newZoom: number) => {
    startTransition(() => {
      setZoomLevel(newZoom);
      console.log(`Zoom level changed to: ${newZoom}`);
    });
  }, []);

  // Reset zoom - wrapped in transition for smoother UI
  const handleResetZoom = useCallback(() => {
    startTransition(() => {
      setZoomLevel(1);
      // If we have graph data, zoom to fit
      if (graphRendererRef.current && graphData && graphData.nodes.length > 0) {
        setTimeout(() => {
          if (graphRendererRef.current) {
            graphRendererRef.current.setZoom(1);
          }
        }, 50);
      }
    });
  }, [graphData]);
  
  // Memoized retry handler
  const handleRetry = useCallback(() => {
    console.log("Manual retry requested for graph data");
    setIsManualRetry(true);
    fetchGraphData();
  }, [fetchGraphData]);

  return {
    graphData,
    loading,
    loadingTime,
    error,
    highlightedNodeId,
    zoomLevel,
    isPending,
    graphRendererRef,
    graphStats,
    handleNodeFound,
    handleZoomChange,
    handleResetZoom,
    handleRetry
  };
}
