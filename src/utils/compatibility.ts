
/**
 * Compatibility utilities for handling potentially missing or invalid data
 * to prevent runtime errors and make the codebase more resilient.
 */

/**
 * Ensure a value is a string, converting null/undefined to empty string
 */
export function ensureString(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  return String(value);
}

/**
 * Ensure a value is a number, converting invalid values to a default
 */
export function ensureNumber(value: any, defaultValue = 0): number {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return defaultValue;
  }
  
  return Number(value);
}

/**
 * Ensure a value is a boolean
 */
export function ensureBoolean(value: any, defaultValue = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  return Boolean(value);
}

/**
 * Sanitize graph data to ensure it has all required properties
 */
export function sanitizeGraphData(graphData: any) {
  if (!graphData) {
    return { nodes: [], links: [] };
  }
  
  const nodes = Array.isArray(graphData.nodes) ? graphData.nodes : [];
  const links = Array.isArray(graphData.links) ? graphData.links : [];
  
  // Sanitize nodes
  const sanitizedNodes = nodes.map((node) => ({
    ...node,
    id: ensureString(node.id),
    name: ensureString(node.name || node.title || ''),
    title: ensureString(node.title || node.name || ''),
    x: node.x !== undefined ? ensureNumber(node.x) : undefined,
    y: node.y !== undefined ? ensureNumber(node.y) : undefined
  }));
  
  // Sanitize links
  const sanitizedLinks = links.map((link) => ({
    ...link,
    source: ensureString(typeof link.source === 'object' ? link.source.id : link.source),
    target: ensureString(typeof link.target === 'object' ? link.target.id : link.target),
  }));
  
  return {
    nodes: sanitizedNodes,
    links: sanitizedLinks
  };
}
