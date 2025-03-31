
/**
 * Compatibility utilities for RelationshipGraph component
 */
import { GraphNode, GraphLink, GraphData } from './types';

/**
 * Create compatibility layer for different GraphRenderer versions
 */
export function createCompatibleGraphRef(modernRef: any) {
  return {
    centerOn: (nodeId: string) => {
      if (modernRef.centerOnNode) {
        modernRef.centerOnNode(nodeId);
      }
    },
    setZoom: (zoomLevel: number) => {
      if (modernRef.setZoom) {
        modernRef.setZoom(zoomLevel);
      }
    },
    zoomToFit: () => {
      if (modernRef.zoomToFit) {
        modernRef.zoomToFit();
      }
    }
  };
}

/**
 * Ensure GraphData is valid and contains required properties
 */
export function ensureValidGraphData(data: any): GraphData {
  if (!data) {
    return { nodes: [], links: [] };
  }
  
  // Ensure nodes have required properties
  const validNodes = Array.isArray(data.nodes) ? data.nodes.map((node: any) => ({
    id: node.id || String(Math.random()),
    name: node.name || node.title || 'Unnamed',
    title: node.title || node.name || 'Unnamed',
    type: node.type || 'unknown',
    ...node
  })) : [];
  
  // Ensure links have required properties
  const validLinks = Array.isArray(data.links) ? data.links.map((link: any) => ({
    source: link.source,
    target: link.target,
    type: link.type || 'default',
    ...link
  })) : [];
  
  return {
    nodes: validNodes,
    links: validLinks
  };
}
