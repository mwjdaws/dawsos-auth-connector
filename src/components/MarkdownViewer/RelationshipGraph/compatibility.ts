
/**
 * Compatibility utilities for the RelationshipGraph component
 */
import { GraphData, GraphNode, GraphLink, GraphProps } from './types';

/**
 * Convert potentially undefined zoom to a safe number
 */
export function ensureValidZoom(zoom: number | undefined): number {
  if (typeof zoom !== 'number' || isNaN(zoom)) {
    return 1; // Default zoom
  }
  return Math.max(0.1, Math.min(3, zoom)); // Clamp between 0.1 and 3
}

/**
 * Ensures graph data is never undefined or null
 */
export function ensureValidGraphData(data: GraphData | null | undefined): GraphData {
  if (!data) {
    return { nodes: [], links: [] };
  }
  
  return {
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    links: Array.isArray(data.links) ? data.links : []
  };
}

/**
 * Creates a compatibility layer for graph props
 */
export function createSafeGraphProps(props: Partial<GraphProps> | null | undefined): GraphProps {
  return {
    startingNodeId: props?.startingNodeId || '',
    width: typeof props?.width === 'number' ? props.width : 800,
    height: typeof props?.height === 'number' ? props.height : 600,
    hasAttemptedRetry: !!props?.hasAttemptedRetry
  };
}

/**
 * Creates a safe reference for graph node operations
 */
export function createCompatibleGraphRef(ref: any): any {
  if (!ref) {
    return {
      centerOn: () => {},
      setZoom: () => {},
      zoomToFit: () => {}
    };
  }
  
  return ref;
}

/**
 * Sanitizes graph data to ensure all required properties exist
 */
export function sanitizeGraphData(data: GraphData): GraphData {
  // Ensure nodes have all required properties
  const nodes = (data.nodes || []).map((node) => {
    const nodeId = String(node.id || '');
    const nodeName = String(node.name || node.title || '');
    const nodeTitle = String(node.title || node.name || '');
    const nodeType = String(node.type || 'default');
    
    return {
      ...node,
      id: nodeId,
      name: nodeName,
      title: nodeTitle,
      type: nodeType
    };
  });
  
  // Ensure links have all required properties
  const links = (data.links || []).map((link) => {
    const linkSource = String(link.source || '');
    const linkTarget = String(link.target || '');
    const linkType = String(link.type || 'default');
    
    return {
      ...link,
      source: linkSource,
      target: linkTarget,
      type: linkType
    };
  });
  
  return { nodes, links };
}
