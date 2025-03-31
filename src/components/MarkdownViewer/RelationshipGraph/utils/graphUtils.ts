
/**
 * Graph utility functions for the relationship graph visualization
 */
import { GraphNode, GraphLink } from '../components/graph-renderer/GraphRendererTypes';

/**
 * Get a unique identifier for a graph link.
 */
export function getLinkId(link: GraphLink): string {
  const sourceId = typeof link.source === 'object' && link.source ? link.source.id : link.source;
  const targetId = typeof link.target === 'object' && link.target ? link.target.id : link.target;
  return `${sourceId}-${targetId}-${link.type || 'default'}`;
}

/**
 * Get a human-readable label for a graph node.
 */
export function getNodeLabel(node: GraphNode): string {
  return node.title || node.name || node.id || 'Unknown Node';
}

/**
 * Find a node by its ID in the graph.
 */
export function findNodeById(nodes: GraphNode[], id: string): GraphNode | undefined {
  return nodes.find(node => node.id === id);
}

/**
 * Generate a color for a link based on its type.
 */
export function getLinkColor(type: string): string {
  const colorMap: Record<string, string> = {
    'manual': '#3b82f6',  // blue
    'wikilink': '#10b981', // green
    'AI-suggested': '#f59e0b', // amber
    'default': '#9ca3af'  // gray
  };
  
  return colorMap[type] || colorMap.default;
}

/**
 * Generate a graph visualization configuration option for a specific entity.
 */
export function getGraphConfig(entityType: string, isHighlighted: boolean = false): {
  color: string;
  size: number;
} {
  const configs: Record<string, { color: string; size: number }> = {
    'document': { color: '#3b82f6', size: 5 },  // blue
    'term': { color: '#10b981', size: 4 },      // green
    'entity': { color: '#f59e0b', size: 3.5 },  // amber
    'concept': { color: '#8b5cf6', size: 4 },   // violet
    'default': { color: '#6b7280', size: 4 }    // gray
  };
  
  const config = configs[entityType] || configs.default;
  
  if (isHighlighted) {
    return {
      color: '#ff3e00',  // highlight color
      size: config.size * 1.3
    };
  }
  
  return config;
}
