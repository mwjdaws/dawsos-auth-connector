
/**
 * Compatibility layer for relationship graph component
 */
import { MutableRefObject, RefObject } from 'react';
import { GraphNode, GraphLink, GraphData, GraphRendererRef } from './types';

/**
 * Create a forward-compatible graph ref for legacy components
 */
export function createCompatibleGraphRef(ref: MutableRefObject<GraphRendererRef | null>): MutableRefObject<any> {
  // Simply return the ref as-is for now, but this function can be expanded
  // to provide backward compatibility as needed
  return ref;
}

/**
 * Convert legacy graph data to new format
 */
export function convertLegacyGraphData(data: any): GraphData {
  if (!data) return { nodes: [], links: [] };
  
  // Handle case where data is already in correct format
  if (Array.isArray(data.nodes) && Array.isArray(data.links)) {
    return data as GraphData;
  }
  
  // Handle legacy format
  return {
    nodes: Array.isArray(data.nodes) 
      ? data.nodes.map((node: any) => ({
          id: node.id || `node-${Math.random().toString(36).substring(2, 9)}`,
          name: node.name || node.title || node.label || 'Unnamed Node',
          ...node
        }))
      : [],
    links: Array.isArray(data.links) || Array.isArray(data.edges)
      ? (data.links || data.edges).map((link: any) => ({
          source: typeof link.source === 'object' ? link.source.id : link.source,
          target: typeof link.target === 'object' ? link.target.id : link.target,
          ...link
        }))
      : []
  };
}
