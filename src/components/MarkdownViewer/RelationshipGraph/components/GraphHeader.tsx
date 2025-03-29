
/**
 * GraphHeader Component
 * 
 * Displays information about the graph at the top of the visualization,
 * including the title and statistics about the number of nodes and connections.
 */
import React from 'react';
import { GraphData } from '../types';

interface GraphHeaderProps {
  graphData: GraphData;  // The graph data containing nodes and links
}

export function GraphHeader({ graphData }: GraphHeaderProps) {
  return (
    <div className="p-2 border-b bg-muted/20 flex justify-between items-center">
      <h3 className="text-sm font-medium">Knowledge Relationship Graph</h3>
      <div className="text-xs text-muted-foreground">
        {graphData.nodes.length} nodes, {graphData.links.length} connections
      </div>
    </div>
  );
}
