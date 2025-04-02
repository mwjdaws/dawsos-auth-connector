
import React from 'react';
import { GraphRenderer } from './components/graph-renderer/GraphRenderer';
import { GraphData, GraphRendererRef } from './types';
import { ensureString, ensureNumber, sanitizeGraphData } from '@/utils/compatibility';

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
    const sanitizedData: GraphData = sanitizeGraphData(graphData);
    
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
