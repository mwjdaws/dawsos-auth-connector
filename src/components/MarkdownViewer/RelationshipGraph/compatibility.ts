
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

// Export any compatibility functions needed for different graph implementations
export function adaptGraphNode(node: GraphNode): GraphNode {
  return {
    ...node,
    title: node.title || node.name || node.id
  };
}

export function adaptGraphLink(link: GraphLink): GraphLink {
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
