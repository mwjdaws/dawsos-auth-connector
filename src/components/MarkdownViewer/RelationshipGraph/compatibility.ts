
/**
 * Compatibility utilities for the Relationship Graph
 */
import { GraphData, GraphNode, GraphLink } from './types';

/**
 * Ensures non-null graph data
 */
export function ensureGraphData(data: GraphData | null | undefined): GraphData {
  if (!data) return { nodes: [], links: [] };
  return {
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    links: Array.isArray(data.links) ? data.links : []
  };
}

/**
 * Ensures a node has all required properties
 */
export function ensureValidNode(node: any): GraphNode {
  if (!node) return { id: generateTempId() };
  
  return {
    id: node.id || generateTempId(),
    title: node.title || node.name || '',
    name: node.name || node.title || '',
    type: node.type || 'unknown',
    ...node
  };
}

/**
 * Ensures a link has all required properties
 */
export function ensureValidLink(link: any, nodes: GraphNode[]): GraphLink | null {
  if (!link) return null;
  
  // Validate source and target
  const source = typeof link.source === 'string' ? link.source : link.source?.id;
  const target = typeof link.target === 'string' ? link.target : link.target?.id;
  
  if (!source || !target) return null;
  
  // Ensure source and target nodes exist
  const sourceExists = nodes.some(n => n.id === source);
  const targetExists = nodes.some(n => n.id === target);
  
  if (!sourceExists || !targetExists) return null;
  
  return {
    source,
    target,
    type: link.type || 'default',
    ...link
  };
}

/**
 * Generates a temporary ID for graph nodes
 */
export function generateTempId(): string {
  return `node-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Adapts graph data to ensure types are correct
 */
export function adaptGraphData(data: any): GraphData {
  if (!data) return { nodes: [], links: [] };
  
  const adaptedNodes = Array.isArray(data.nodes) 
    ? data.nodes.map(ensureValidNode).filter(Boolean)
    : [];
  
  const adaptedLinks = Array.isArray(data.links)
    ? data.links.map(link => ensureValidLink(link, adaptedNodes)).filter(Boolean)
    : [];
  
  return {
    nodes: adaptedNodes,
    links: adaptedLinks as GraphLink[]
  };
}

/**
 * Type-safe wrapper for graph renderer ref methods
 */
export function wrapGraphRendererRef(ref: any) {
  if (!ref) return null;
  
  return {
    centerOnNode: (nodeId: string) => {
      if (ref.current && typeof ref.current.centerOnNode === 'function') {
        ref.current.centerOnNode(nodeId);
      }
    },
    centerAt: (x: number, y: number, duration = 1000) => {
      if (ref.current && typeof ref.current.centerAt === 'function') {
        ref.current.centerAt(x, y, duration);
      }
    },
    zoomToFit: (duration = 1000) => {
      if (ref.current && typeof ref.current.zoomToFit === 'function') {
        ref.current.zoomToFit(duration);
      }
    },
    setZoom: (zoomLevel: number) => {
      if (ref.current && typeof ref.current.setZoom === 'function') {
        ref.current.setZoom(zoomLevel);
      }
    },
    getGraphData: () => {
      if (ref.current && typeof ref.current.getGraphData === 'function') {
        return ref.current.getGraphData();
      }
      return { nodes: [], links: [] };
    }
  };
}
