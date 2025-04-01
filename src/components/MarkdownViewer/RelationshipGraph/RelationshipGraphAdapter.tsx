
import React from 'react';
import { GraphRenderer } from './components/graph-renderer/GraphRenderer';
import { GraphData } from './components/graph-renderer/GraphRendererTypes';
import type { GraphRendererRef } from './components/graph-renderer/GraphRendererTypes';
import { ensureString, ensureNumber, ensureBoolean } from '@/utils/compatibility';

interface RelationshipGraphAdapterProps {
  graphData: GraphData;
  width?: number;
  height?: number;
  zoom?: number;
  highlightedNodeId?: string | null;
  onNodeClick?: ((nodeId: string) => void) | undefined;
  onLinkClick?: ((source: string, target: string) => void) | undefined;
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
    // Sanitize graph data to ensure it's in the correct format
    const sanitizedData: GraphData = {
      nodes: graphData.nodes.map((node) => ({
        ...node,
        id: ensureString(node.id),
        name: ensureString(node.name || node.title || ''),
        title: ensureString(node.title || node.name || ''),
      })),
      links: graphData.links.map((link) => ({
        ...link,
        source: ensureString(typeof link.source === 'object' ? link.source.id : link.source),
        target: ensureString(typeof link.target === 'object' ? link.target.id : link.target),
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
