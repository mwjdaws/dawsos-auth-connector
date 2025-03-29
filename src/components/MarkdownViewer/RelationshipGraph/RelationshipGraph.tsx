
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
import React from 'react';
import { useGraphData } from './hooks/useGraphData';
import { GraphHeader } from './components/GraphHeader';
import { GraphRenderer } from './components/GraphRenderer';
import { GraphLoading } from './components/GraphLoading';
import { GraphError } from './components/GraphError';
import { RelationshipGraphProps } from './types';

export function RelationshipGraph({ 
  startingNodeId, 
  width = 800, 
  height = 600 
}: RelationshipGraphProps) {
  // Fetch graph data and track loading/error states
  const { graphData, loading, error, fetchGraphData } = useGraphData(startingNodeId);
  
  // Show loading state while fetching data
  if (loading) {
    return <GraphLoading />;
  }
  
  // Show error state if there was a problem fetching data
  if (error) {
    return <GraphError error={error} onRetry={fetchGraphData} />;
  }
  
  // Render the graph when data is available
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <GraphHeader graphData={graphData} />
      <GraphRenderer graphData={graphData} width={width} height={height} />
    </div>
  );
}
