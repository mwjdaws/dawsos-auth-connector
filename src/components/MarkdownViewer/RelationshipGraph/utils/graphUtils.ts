
/**
 * Graph Utilities
 * 
 * This module provides utility functions for working with graph data.
 */
import { ensureString } from '@/utils/type-compatibility';
import { GraphData, GraphNode, GraphLink } from '@/hooks/markdown-editor/types';

/**
 * Formats a graph node ID to ensure it's a valid string
 */
export function formatNodeId(id: string | undefined | null): string {
  return ensureString(id);
}

/**
 * Creates a color map based on node types
 */
export function createColorMap(nodes: GraphNode[]): Record<string, string> {
  const colorMap: Record<string, string> = {};
  const types = [...new Set(nodes.map(node => node.type))];
  
  // Default colors for common node types
  const defaultColors: Record<string, string> = {
    'source': '#3B82F6', // blue
    'term': '#10B981',   // green
    'domain': '#8B5CF6', // purple
    'tag': '#F59E0B',    // amber
    'default': '#6B7280' // gray
  };
  
  types.forEach(type => {
    colorMap[type] = defaultColors[type] || defaultColors.default;
  });
  
  return colorMap;
}

/**
 * Formats link labels for display
 */
export function formatLinkLabel(link: GraphLink): string {
  if (!link.label) return '';
  return link.label.charAt(0).toUpperCase() + link.label.slice(1);
}

/**
 * Generate link width based on type
 */
export function getLinkWidth(link: GraphLink): number {
  switch (link.type) {
    case 'strong':
      return 2;
    case 'weak':
      return 0.5;
    default:
      return 1;
  }
}

/**
 * Safety utility to ensure graph data is valid
 */
export function safeGraphData(data: GraphData | null | undefined): GraphData {
  if (!data) return { nodes: [], links: [] };
  
  // Ensure all nodes have valid IDs and labels
  const validNodes = (data.nodes || []).map(node => ({
    ...node,
    id: ensureString(node.id),
    label: ensureString(node.label),
    type: ensureString(node.type)
  }));
  
  // Ensure all links have valid source and target references
  const validLinks = (data.links || []).filter(link => 
    typeof link.source === 'string' && 
    typeof link.target === 'string' &&
    validNodes.some(node => node.id === link.source) &&
    validNodes.some(node => node.id === link.target)
  );
  
  return {
    nodes: validNodes,
    links: validLinks
  };
}
