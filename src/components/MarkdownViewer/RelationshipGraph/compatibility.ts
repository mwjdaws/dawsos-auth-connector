
/**
 * Compatibility utilities for the relationship graph component
 * These help ensure backward compatibility with older code
 */
import { GraphProps, GraphRendererRef } from './types';
import { GraphData, GraphNode, GraphLink } from './components/graph-renderer/GraphRendererTypes';

/**
 * Create safe graph properties with defaults for any missing values
 */
export function createSafeGraphProps(props: GraphProps): {
  startingNodeId: string | undefined;
  width: number;
  height: number;
  hasAttemptedRetry: boolean;
} {
  return {
    startingNodeId: props.startingNodeId,
    width: props.width || 800,
    height: props.height || 600,
    hasAttemptedRetry: props.hasAttemptedRetry || false
  };
}

/**
 * Create a compatibility layer for the GraphRendererRef
 * This allows older code to use the new ref structure
 */
export function createCompatibleGraphRef(ref: GraphRendererRef): any {
  if (!ref) {
    return null;
  }
  
  return {
    centerOn: (nodeId: string) => {
      if (ref.centerOnNode) {
        ref.centerOnNode(nodeId);
      }
    },
    zoomToFit: (duration?: number) => {
      if (ref.zoomToFit) {
        ref.zoomToFit(duration);
      }
    },
    resetViewport: () => {
      if (ref.resetZoom) {
        ref.resetZoom();
      }
    },
    getGraphData: ref.getGraphData,
    setZoom: ref.setZoom
  };
}

/**
 * Convert legacy node data to the new GraphNode format
 */
export function convertToGraphNode(node: any): GraphNode {
  return {
    id: node.id || '',
    title: node.title || node.name || node.id || 'Unknown',
    name: node.name || node.title || node.id || 'Unknown',
    type: node.type || 'document',
    domain: node.domain
  };
}

/**
 * Convert legacy link data to the new GraphLink format
 */
export function convertToGraphLink(link: any): GraphLink {
  return {
    source: link.source || '',
    target: link.target || '',
    type: link.type || 'default'
  };
}

/**
 * Create safe graph data with proper typing
 */
export function createSafeGraphData(data: any): GraphData {
  if (!data) {
    return { nodes: [], links: [] };
  }
  
  const nodes = Array.isArray(data.nodes) ? data.nodes.map(convertToGraphNode) : [];
  const links = Array.isArray(data.links) ? data.links.map(convertToGraphLink) : [];
  
  return { nodes, links };
}

/**
 * Safely extract a node ID from a node or ID string
 */
export function getSafeNodeId(nodeOrId: GraphNode | string | undefined | null): string | null {
  if (!nodeOrId) {
    return null;
  }
  
  if (typeof nodeOrId === 'string') {
    return nodeOrId;
  }
  
  return nodeOrId.id || null;
}
