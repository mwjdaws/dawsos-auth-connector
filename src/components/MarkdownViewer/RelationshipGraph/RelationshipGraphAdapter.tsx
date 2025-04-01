
import React from 'react';
import { GraphRenderer } from './components/graph-renderer/GraphRenderer';
import { GraphData, GraphNode, GraphLink, GraphRendererRef } from './types';
import { ensureString, ensureNumber, ensureBoolean } from '@/utils/compatibility';

interface RelationshipGraphAdapterProps {
  graphData: GraphData;
  width?: number;
  height?: number;
  zoom?: number;
  highlightedNodeId?: string | null;
  onNodeClick?: (nodeId: string) => void;
  onLinkClick?: (source: string, target: string) => void;
}

export const RelationshipGraphAdapter = React.forwardRef<GraphRendererRef, RelationshipGraphAdapterProps>(
  ({ 
    graphData, 
    width = 800, 
    height = 600, 
    zoom = 1, 
    highlightedNodeId = null,
    onNodeClick,
    onLinkClick
  }, ref) => {
    // Ensure data is in the correct format
    const sanitizedData: GraphData = {
      nodes: graphData.nodes.map((node: GraphNode) => ({
        ...node,
        id: ensureString(node.id),
        name: ensureString(node.name),
        title: ensureString(node.title),
      })),
      links: graphData.links.map((link: GraphLink) => ({
        ...link,
        source: ensureString(link.source),
        target: ensureString(link.target),
      }))
    };
    
    return (
      <GraphRenderer
        ref={ref}
        graphData={sanitizedData}
        width={ensureNumber(width)}
        height={ensureNumber(height)}
        zoom={ensureNumber(zoom)}
        highlightedNodeId={highlightedNodeId}
        onNodeClick={onNodeClick}
        onLinkClick={onLinkClick}
      />
    );
  }
);

RelationshipGraphAdapter.displayName = 'RelationshipGraphAdapter';
