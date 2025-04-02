
/**
 * Compatibility file for the relationship graph component
 * 
 * This file provides backward compatibility for components using the old import paths
 * and ensures there's a consistent interface for the graph renderer components.
 */
import { GraphNode, GraphLink, GraphData, GraphRendererRef } from './types';

// Re-export types
export type {
  GraphNode,
  GraphLink,
  GraphData,
  GraphRendererRef
};

// Export sanitized graph data function needed by various components
export function sanitizeGraphData(data: any): GraphData {
  if (!data || typeof data !== 'object') {
    return { nodes: [], links: [] };
  }
  
  const sanitizedData: GraphData = {
    nodes: Array.isArray(data.nodes) ? data.nodes.map(adaptGraphNode) : [],
    links: Array.isArray(data.links) ? data.links.map(adaptGraphLink) : []
  };
  
  return sanitizedData;
}

// Export any compatibility functions needed for different graph implementations
export function adaptGraphNode(node: any): GraphNode {
  if (!node || typeof node !== 'object') {
    return { id: 'unknown', name: 'Unknown Node' };
  }
  
  return {
    ...node,
    id: node.id || 'unknown',
    name: node.name || node.title || node.id || 'Unknown',
    title: node.title || node.name || node.id
  };
}

export function adaptGraphLink(link: any): GraphLink {
  if (!link || typeof link !== 'object') {
    return { source: 'unknown', target: 'unknown' };
  }
  
  const source = typeof link.source === 'object' ? link.source.id : link.source;
  const target = typeof link.target === 'object' ? link.target.id : link.target;
  
  return {
    ...link,
    source,
    target
  };
}

export function adaptGraphData(data: GraphData): GraphData {
  return {
    nodes: data.nodes.map(adaptGraphNode),
    links: data.links.map(adaptGraphLink)
  };
}

// Compatibility alias
export const ensureValidGraphData = sanitizeGraphData;
