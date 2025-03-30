
import { GraphData, GraphNode, GraphLink } from '../types';
import { ensureString, ensureNumber } from '../compatibility';

/**
 * Helper function to find a node by ID
 */
export function findNodeById(nodes: GraphNode[], id: string | null | undefined): GraphNode | undefined {
  if (!id) return undefined;
  return nodes.find(node => node.id === id);
}

/**
 * Creates a default node with required properties
 */
export function createDefaultNode(id: string, title: string, type: string = 'document'): GraphNode {
  return {
    id: ensureString(id),
    title: ensureString(title),
    name: ensureString(title), // Name is used for display in some renderers
    type: ensureString(type),
    val: 1
  };
}

/**
 * Creates a default link between nodes
 */
export function createDefaultLink(sourceId: string, targetId: string, type: string = 'default'): GraphLink {
  return {
    source: ensureString(sourceId),
    target: ensureString(targetId),
    type: ensureString(type)
  };
}

/**
 * Merges two graph data objects
 */
export function mergeGraphData(data1: GraphData, data2: GraphData): GraphData {
  const nodeIds = new Set<string>();
  const linkKeys = new Set<string>();
  const mergedNodes: GraphNode[] = [];
  const mergedLinks: GraphLink[] = [];
  
  // Process nodes from data1
  data1.nodes.forEach(node => {
    if (!nodeIds.has(node.id)) {
      nodeIds.add(node.id);
      mergedNodes.push({...node});
    }
  });
  
  // Process nodes from data2
  data2.nodes.forEach(node => {
    if (!nodeIds.has(node.id)) {
      nodeIds.add(node.id);
      mergedNodes.push({...node});
    }
  });
  
  // Process links from data1
  data1.links.forEach(link => {
    const linkKey = `${link.source}-${link.target}-${link.type}`;
    if (!linkKeys.has(linkKey)) {
      linkKeys.add(linkKey);
      mergedLinks.push({...link});
    }
  });
  
  // Process links from data2
  data2.links.forEach(link => {
    const linkKey = `${link.source}-${link.target}-${link.type}`;
    if (!linkKeys.has(linkKey)) {
      linkKeys.add(linkKey);
      mergedLinks.push({...link});
    }
  });
  
  return { nodes: mergedNodes, links: mergedLinks };
}

/**
 * Safely formats a graph node for display
 */
export function formatNodeLabel(node: GraphNode | undefined): string {
  if (!node) return 'Unknown';
  return ensureString(node.title || node.name);
}
