
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
 * Ensure zoom value is within valid range
 */
export function ensureValidZoom(zoom: any, minZoom = 0.1, maxZoom = 4, defaultZoom = 1): number {
  const numZoom = ensureNumber(zoom, defaultZoom);
  return Math.max(minZoom, Math.min(maxZoom, numZoom));
}

/**
 * Make sure that graph data has required node and link properties for rendering
 */
export function ensureValidGraphData(graphData: any) {
  if (!graphData) {
    return { nodes: [], links: [] };
  }
  
  const nodes = Array.isArray(graphData.nodes) ? graphData.nodes : [];
  const links = Array.isArray(graphData.links) ? graphData.links : [];
  
  return { nodes, links };
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
  const sanitizedNodes = nodes.map((node: any) => ({
    ...node,
    id: ensureString(node.id),
    name: ensureString(node.name || node.title || ''),
    title: ensureString(node.title || node.name || ''),
    x: node.x !== undefined ? ensureNumber(node.x) : undefined,
    y: node.y !== undefined ? ensureNumber(node.y) : undefined
  }));
  
  // Sanitize links
  const sanitizedLinks = links.map((link: any) => ({
    ...link,
    source: ensureString(typeof link.source === 'object' ? link.source.id : link.source),
    target: ensureString(typeof link.target === 'object' ? link.target.id : link.target),
  }));
  
  return {
    nodes: sanitizedNodes,
    links: sanitizedLinks
  };
}

/**
 * Create safe props for graph rendering
 */
export function createSafeGraphProps(props: any) {
  return {
    width: ensureNumber(props.width, 800),
    height: ensureNumber(props.height, 600),
    zoom: ensureValidZoom(props.zoom),
    graphData: sanitizeGraphData(props.graphData),
    highlightedNodeId: props.highlightedNodeId || null
  };
}

/**
 * Safe callback function invocation with optional parameters
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined | null,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return undefined;
}
