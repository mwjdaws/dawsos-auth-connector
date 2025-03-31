
import { GraphData, GraphNode, GraphLink, GraphProps, RelationshipGraphPanelProps, GraphRendererRef } from './types';

/**
 * Creates safe GraphProps from possibly undefined values
 */
export function createSafeGraphProps(props: GraphProps): GraphProps {
  return {
    startingNodeId: props.startingNodeId || '',
    width: props.width || 800,
    height: props.height || 600,
    hasAttemptedRetry: props.hasAttemptedRetry || false
  };
}

/**
 * Normalizes node ID types
 */
export function normalizeNodeId(nodeId: string | null | undefined): string | null {
  return typeof nodeId === 'string' ? nodeId : null;
}

/**
 * Safely converts graph data to ensure type compatibility
 */
export function sanitizeGraphData(data: any): GraphData {
  if (!data) {
    return { nodes: [], links: [] };
  }

  const nodes = Array.isArray(data.nodes) ? data.nodes.map(sanitizeNode) : [];
  const links = Array.isArray(data.links) ? data.links.map(sanitizeLink) : [];

  return { nodes, links };
}

/**
 * Ensures a GraphNode has required properties
 */
function sanitizeNode(node: any): GraphNode {
  if (!node) return { id: `node-${Math.random().toString(36).substring(2, 9)}` };
  
  return {
    id: node.id || `node-${Math.random().toString(36).substring(2, 9)}`,
    name: node.name || node.title || node.id || 'Unknown',
    ...node
  };
}

/**
 * Ensures a GraphLink has required properties
 */
function sanitizeLink(link: any): GraphLink {
  if (!link) return { source: '', target: '' };
  
  return {
    source: typeof link.source === 'object' ? link.source.id : String(link.source || ''),
    target: typeof link.target === 'object' ? link.target.id : String(link.target || ''),
    ...link
  };
}

/**
 * Creates a GraphRendererRef adapter for compatibility with the modern GraphRenderer
 */
export function createCompatibleGraphRef(modernRef: any): GraphRendererRef {
  return {
    centerOn: (nodeId: string) => {
      if (modernRef && typeof modernRef.centerOnNode === 'function') {
        modernRef.centerOnNode(nodeId);
      }
    },
    zoomIn: () => {
      if (modernRef && typeof modernRef.zoomIn === 'function') {
        modernRef.zoomIn();
      }
    },
    zoomOut: () => {
      if (modernRef && typeof modernRef.zoomOut === 'function') {
        modernRef.zoomOut();
      }
    },
    resetZoom: () => {
      if (modernRef && typeof modernRef.resetZoom === 'function') {
        modernRef.resetZoom();
      }
    },
    setZoom: (zoomLevel: number) => {
      if (modernRef && typeof modernRef.setZoom === 'function') {
        modernRef.setZoom(zoomLevel);
      }
    },
    exportImage: () => {
      if (modernRef && typeof modernRef.exportImage === 'function') {
        return modernRef.exportImage();
      }
      return '';
    }
  };
}
