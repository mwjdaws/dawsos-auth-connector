
import React from 'react';
import { GraphNode, GraphLink, GraphData } from '../../types';

/**
 * Adapter for node data
 */
export function adaptNodeData(node: GraphNode): GraphNode {
  return {
    ...node, // Use spread first to avoid overwriting properties
    id: node.id,
    name: node.name || node.title || node.id
  };
}

/**
 * Adapter for link data
 */
export function adaptLinkData(link: GraphLink): GraphLink {
  return {
    ...link, // Use spread first to avoid overwriting properties
    source: typeof link.source === 'object' ? (link.source as any).id : link.source,
    target: typeof link.target === 'object' ? (link.target as any).id : link.target
  };
}

/**
 * Adapter for graph data
 */
export function adaptGraphData(data: GraphData): GraphData {
  if (!data) {
    return { nodes: [], links: [] };
  }

  return {
    nodes: Array.isArray(data.nodes) ? data.nodes.map(adaptNodeData) : [],
    links: Array.isArray(data.links) ? data.links.map(adaptLinkData) : []
  };
}

/**
 * Type guard function for checking if a node object is valid
 */
export function isValidNode(node: any): node is GraphNode {
  return node && typeof node.id === 'string';
}

/**
 * Type guard function for checking if a link object is valid
 */
export function isValidLink(link: any): link is GraphLink {
  return link && 
    ((typeof link.source === 'string') || (typeof link.source === 'object' && link.source !== null)) &&
    ((typeof link.target === 'string') || (typeof link.target === 'object' && link.target !== null));
}

/**
 * Safely process node event
 */
export function safeNodeHandler(handler?: (nodeId: string) => void) {
  return (node: any) => {
    if (node && handler) {
      const nodeId = typeof node === 'object' ? node.id : node;
      if (typeof nodeId === 'string') {
        handler(nodeId);
      }
    }
  };
}
