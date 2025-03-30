
/**
 * Compatibility layer for RelationshipGraph
 * 
 * This module provides utility functions and types to ensure compatibility
 * between different versions of the relationship graph components.
 */
import { GraphData, GraphNode, GraphLink } from '@/hooks/markdown-editor/types';
import { ensureString } from '@/utils/type-compatibility';

// Ensure string values are valid
export { ensureString };

/**
 * Ensures a graph node has all required properties with valid types
 */
export function normalizeNode(node: any): GraphNode {
  return {
    id: ensureString(node.id),
    label: ensureString(node.label),
    type: ensureString(node.type),
    color: node.color || undefined,
    domain: node.domain || undefined
  };
}

/**
 * Ensures a graph link has all required properties with valid types
 */
export function normalizeLink(link: any): GraphLink {
  return {
    source: ensureString(link.source),
    target: ensureString(link.target),
    label: link.label || undefined,
    type: link.type || undefined
  };
}

/**
 * Normalizes graph data to ensure it's compatible with the graph renderer
 */
export function normalizeGraphData(data: any): GraphData {
  if (!data) return { nodes: [], links: [] };
  
  return {
    nodes: Array.isArray(data.nodes) ? data.nodes.map(normalizeNode) : [],
    links: Array.isArray(data.links) ? data.links.map(normalizeLink) : []
  };
}

/**
 * Prop compatibility types for the relationship graph
 */
export interface UseRelationshipGraphProps {
  startingNodeId: string;
  hasAttemptedRetry?: boolean;
  width?: number;
  height?: number;
}

export interface GraphRendererRef {
  zoomToFit: () => void;
  getGraphData: () => GraphData;
}
