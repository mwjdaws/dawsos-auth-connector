
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
  const { graphData, loading, error, fetchGraphData } = useGraphData(startingNodeId);
  
  if (loading) {
    return <GraphLoading />;
  }
  
  if (error) {
    return <GraphError error={error} onRetry={fetchGraphData} />;
  }
  
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <GraphHeader graphData={graphData} />
      <GraphRenderer graphData={graphData} width={width} height={height} />
    </div>
  );
}
