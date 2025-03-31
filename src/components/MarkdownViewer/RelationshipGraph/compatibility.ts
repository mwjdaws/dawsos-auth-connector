
/**
 * Compatibility utilities for the relationship graph component
 * These help ensure backward compatibility with older code
 */
import { GraphProps, GraphRendererRef, RelationshipGraphProps } from './types';
import { GraphData, GraphNode, GraphLink } from './components/graph-renderer/GraphRendererTypes';

/**
 * Create safe graph properties with defaults for any missing values
 */
export function createSafeGraphProps(props: GraphProps): RelationshipGraphProps {
  return {
    startingNodeId: props.startingNodeId || '',
    width: props.width || 800,
    height: props.height || 600,
    hasAttemptedRetry: props.hasAttemptedRetry || false
  };
}

/**
 * Create a compatibility layer for the GraphRendererRef
 * This allows older code to use the new ref structure
 */
export function createCompatibleGraphRef(ref: any): GraphRendererRef {
  if (!ref) {
    return {
      centerOn: () => {},
      zoomToFit: () => {},
      resetViewport: () => {},
      getGraphData: () => ({ nodes: [], links: [] }),
      setZoom: () => {}
    };
  }
  
  return {
    centerOn: (nodeId: string) => {
      if (typeof ref.centerOnNode === 'function') {
        ref.centerOnNode(nodeId);
      }
    },
    zoomToFit: (duration?: number) => {
      if (typeof ref.zoomToFit === 'function') {
        ref.zoomToFit(duration);
      }
    },
    resetViewport: () => {
      if (typeof ref.resetZoom === 'function') {
        ref.resetZoom();
      }
    },
    getGraphData: () => {
      if (typeof ref.getGraphData === 'function') {
        return ref.getGraphData() || { nodes: [], links: [] };
      }
      return { nodes: [], links: [] };
    },
    setZoom: (zoomLevel: number) => {
      if (typeof ref.setZoom === 'function') {
        ref.setZoom(zoomLevel);
      }
    }
  };
}

/**
 * Convert legacy node data to the new GraphNode format
 */
export function convertToGraphNode(node: any): GraphNode {
  return {
    id: node?.id || '',
    title: node?.title || node?.name || node?.id || 'Unknown',
    name: node?.name || node?.title || node?.id || 'Unknown',
    type: node?.type || 'document',
    domain: node?.domain || ''
  };
}

/**
 * Convert legacy link data to the new GraphLink format
 */
export function convertToGraphLink(link: any): GraphLink {
  return {
    source: link?.source || '',
    target: link?.target || '',
    type: link?.type || 'default'
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
export function getSafeNodeId(nodeOrId: GraphNode | string | undefined | null): string {
  if (!nodeOrId) {
    return '';
  }
  
  if (typeof nodeOrId === 'string') {
    return nodeOrId;
  }
  
  return nodeOrId.id || '';
}
