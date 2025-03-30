
/**
 * Graph Utilities
 * 
 * Common utility functions for graph data processing and manipulation.
 */
import { GraphNode, GraphLink } from '../types';

/**
 * Get node color based on its type
 * 
 * @param {GraphNode} node - The node to get color for
 * @returns {string} The color value
 */
export function getNodeColor(node: GraphNode): string {
  if (node.color) return node.color;
  
  const typeColors: Record<string, string> = {
    source: '#4299e1',  // blue
    term: '#68d391',    // green
    document: '#f6ad55', // orange
    default: '#a0aec0'  // gray
  };
  
  return node.type && typeColors[node.type]
    ? typeColors[node.type]
    : typeColors.default;
}

/**
 * Get node size based on its type and value
 * 
 * @param {GraphNode} node - The node to get size for
 * @returns {number} The size value
 */
export function getNodeSize(node: GraphNode): number {
  if (node.val) return node.val;
  
  const typeSizes: Record<string, number> = {
    source: 10,
    term: 8,
    document: 7,
    default: 6
  };
  
  return node.type && typeSizes[node.type]
    ? typeSizes[node.type]
    : typeSizes.default;
}

/**
 * Get formatted node label for display
 * 
 * @param {GraphNode} node - The node to format label for
 * @returns {string} The formatted node label
 */
export function getNodeLabel(node: GraphNode): string {
  return node.name || node.title || node.id;
}

/**
 * Ensure all required graph node properties are populated
 * 
 * @param {GraphNode} node - The node to normalize
 * @returns {GraphNode} Normalized node with all required properties
 */
export function normalizeGraphNode(node: GraphNode): GraphNode {
  return {
    ...node,
    title: node.title || node.name || node.id,
    name: node.name || node.title || node.id,
    val: node.val || getNodeSize(node),
    color: node.color || getNodeColor(node)
  };
}
