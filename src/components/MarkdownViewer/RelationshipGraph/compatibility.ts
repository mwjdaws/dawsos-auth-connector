
import { GraphNode, GraphLink } from './types';

/**
 * Ensures a node has a valid ID string
 */
export function ensureNodeId(node: GraphNode): string {
  if (typeof node === 'string') {
    return node;
  }
  return node.id || String(Math.random()).substring(2, 8);
}

/**
 * Gets a safe node property with type checking and default values
 */
export function getNodeProperty<T>(
  node: GraphNode,
  property: string,
  defaultValue: T
): T {
  if (typeof node === 'string') {
    return defaultValue;
  }
  
  const value = (node as any)[property];
  return value !== undefined && value !== null ? value : defaultValue;
}

/**
 * Safely retrieves the source of a link as a string
 */
export function getLinkSource(link: GraphLink): string {
  if (typeof link.source === 'string') {
    return link.source;
  }
  if (link.source && typeof link.source === 'object' && 'id' in link.source) {
    return String(link.source.id);
  }
  return '';
}

/**
 * Safely retrieves the target of a link as a string
 */
export function getLinkTarget(link: GraphLink): string {
  if (typeof link.target === 'string') {
    return link.target;
  }
  if (link.target && typeof link.target === 'object' && 'id' in link.target) {
    return String(link.target.id);
  }
  return '';
}

/**
 * Convert links to be compatible with the graph renderer
 */
export function convertLinks(links: GraphLink[]): GraphLink[] {
  return links.map(link => ({
    ...link,
    source: getLinkSource(link),
    target: getLinkTarget(link)
  }));
}
