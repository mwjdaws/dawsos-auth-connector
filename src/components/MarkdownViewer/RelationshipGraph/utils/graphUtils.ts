
import { GraphNode, GraphLink, GraphData } from '../types';

/**
 * Custom graph node color mappings
 */
export const NODE_COLOR_MAP: Record<string, string> = {
  document: '#4f46e5', // indigo
  category: '#10b981', // emerald
  concept: '#f59e0b', // amber
  person: '#ef4444',  // red
  organization: '#6366f1', // indigo
  default: '#6b7280'  // gray
};

/**
 * Custom graph link color mappings
 */
export const LINK_COLOR_MAP: Record<string, string> = {
  related: '#9ca3af',  // gray
  contains: '#4f46e5', // indigo
  references: '#10b981', // emerald
  created: '#f59e0b',  // amber
  default: '#d1d5db'   // light gray
};

/**
 * Calculate statistics for a graph
 */
export function calculateGraphStats(graphData: GraphData) {
  if (!graphData) {
    return { nodeCount: 0, linkCount: 0, density: 0 };
  }

  const nodeCount = (graphData.nodes || []).length;
  const linkCount = (graphData.links || []).length;
  
  // Calculate graph density (ratio of actual connections to possible connections)
  const possibleConnections = nodeCount * (nodeCount - 1);
  const density = possibleConnections > 0 ? linkCount / possibleConnections : 0;
  
  return {
    nodeCount,
    linkCount,
    density
  };
}

/**
 * Find a node by ID
 */
export function findNodeById(graphData: GraphData, nodeId: string): GraphNode | undefined {
  if (!graphData || !graphData.nodes || !nodeId) {
    return undefined;
  }
  
  return graphData.nodes.find(node => node.id === nodeId);
}

/**
 * Get node title or fallback
 */
export function getNodeTitle(node: GraphNode | null | undefined): string {
  if (!node) return 'Unknown';
  
  return node.title || node.name || node.id || 'Unnamed Node';
}

/**
 * Get node type with fallback
 */
export function getNodeType(node: GraphNode | null | undefined): string {
  if (!node) return 'unknown';
  
  return node.type || 'default';
}

/**
 * Process raw graph data into a normalized format
 */
export function normalizeGraphData(rawData: any): GraphData {
  if (!rawData) {
    return { nodes: [], links: [] };
  }
  
  // Extract and normalize nodes
  const nodes = Array.isArray(rawData.nodes) 
    ? rawData.nodes.map((node: any) => ({
        id: String(node.id || ''),
        name: node.name || node.title || String(node.id || ''),
        ...node
      }))
    : [];
  
  // Extract and normalize links
  const links = Array.isArray(rawData.links) 
    ? rawData.links.map((link: any) => ({
        source: typeof link.source === 'object' ? link.source.id : String(link.source || ''),
        target: typeof link.target === 'object' ? link.target.id : String(link.target || ''),
        ...link
      }))
    : [];
  
  return { nodes, links };
}
