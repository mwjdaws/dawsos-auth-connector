
/**
 * Compatibility layer for RelationshipGraph components
 * Provides type-safe wrappers and utility functions to bridge API differences
 */
import { GraphNode, GraphLink, GraphData, RelationshipGraphProps } from './types';
import { ensureString, ensureNumber, ensureBoolean, createCompatibleGraphRef, createSafeGraphProps } from '@/utils/compatibility';

/**
 * Ensures a node ID is always a string
 */
export function ensureNodeId(id: string | undefined | null): string {
  return ensureString(id);
}

/**
 * Ensures a GraphNode has all required properties
 */
export function ensureValidNode(node: Partial<GraphNode>): GraphNode {
  return {
    id: node.id || '',
    title: node.title || node.name || 'Untitled',
    name: node.name || node.title || 'Unnamed',
    type: node.type || 'document',
    ...node
  };
}

/**
 * Ensures a GraphLink has all required properties
 */
export function ensureValidLink(link: Partial<GraphLink>): GraphLink {
  return {
    source: typeof link.source === 'string' ? link.source : (link.source as any)?.id || '',
    target: typeof link.target === 'string' ? link.target : (link.target as any)?.id || '',
    type: link.type || 'default',
    ...link
  };
}

/**
 * Creates a safe wrapper for node click handlers
 */
export function createSafeNodeClickHandler(
  handler: ((node: GraphNode) => void) | undefined
): (node: any) => void {
  return (node: any) => {
    if (handler && node) {
      handler(ensureValidNode(node));
    }
  };
}

/**
 * Ensures GraphData is valid with proper types
 */
export function ensureValidGraphData(data: Partial<GraphData> | undefined | null): GraphData {
  if (!data) {
    return { nodes: [], links: [] };
  }
  
  return {
    nodes: Array.isArray(data.nodes) 
      ? data.nodes.map(node => ensureValidNode(node))
      : [],
    links: Array.isArray(data.links)
      ? data.links.map(link => ensureValidLink(link))
      : []
  };
}

/**
 * Creates a safe node renderer function
 */
export function createSafeHighlightNodeId(highlightedNodeId: string | null | undefined): string | null {
  return highlightedNodeId === undefined ? null : highlightedNodeId;
}

// Re-export from utils/compatibility
export { createCompatibleGraphRef, createSafeGraphProps };
