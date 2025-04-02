
/**
 * Type Compatibility Utilities
 * 
 * Helpers for ensuring type safety across different data shapes
 */

/**
 * Ensures a value is a string, or returns a default
 */
export function ensureString(value: any, defaultValue: string = ''): string {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

/**
 * Ensures a value is a number, or returns a default
 */
export function ensureNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Ensures a value is a boolean, or returns a default
 */
export function ensureBoolean(value: any, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) return defaultValue;
  return Boolean(value);
}

/**
 * Ensures a value is an array, or returns an empty array
 */
export function ensureArray<T>(value: any, defaultValue: T[] = []): T[] {
  if (Array.isArray(value)) return value;
  return defaultValue;
}

/**
 * Converts null to undefined for optional params
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Converts undefined to null for optional params
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Ensures zoom level is within valid range
 */
export function ensureValidZoom(zoom: number | undefined, min: number = 0.1, max: number = 2): number {
  const validZoom = ensureNumber(zoom, 1);
  return Math.min(Math.max(validZoom, min), max);
}

/**
 * Ensures graph data is valid and includes nodes and links
 */
export function ensureValidGraphData(data: any): { nodes: any[]; links: any[] } {
  if (!data) return { nodes: [], links: [] };
  
  return {
    nodes: ensureArray(data.nodes),
    links: ensureArray(data.links)
  };
}

/**
 * Sanitizes graph data to ensure it meets expected type requirements
 */
export function sanitizeGraphData(data: any): any {
  if (!data) {
    return { nodes: [], links: [] };
  }

  // Ensure nodes array exists
  const nodes = Array.isArray(data.nodes) ? data.nodes : [];
  
  // Ensure links array exists
  const links = Array.isArray(data.links) ? data.links : [];
  
  // Process nodes to ensure required properties
  const processedNodes = nodes.map((node: any = {}) => ({
    id: ensureString(node?.id || `node-${Math.random().toString(36).substr(2, 9)}`),
    name: ensureString(node?.name || node?.title || node?.id || 'Unnamed'),
    title: ensureString(node?.title || node?.name || ''),
    type: ensureString(node?.type || 'default'),
    color: ensureString(node?.color || '#6e56cf'),
    ...node
  }));
  
  // Process links to ensure required properties
  const processedLinks = links.map((link: any = {}) => {
    // Handle source and target as objects or strings
    const source = typeof link?.source === 'object' && link?.source !== null
      ? ensureString(link.source.id)
      : ensureString(link?.source);
    
    const target = typeof link?.target === 'object' && link?.target !== null
      ? ensureString(link.target.id)
      : ensureString(link?.target);
    
    return {
      source,
      target,
      type: ensureString(link?.type || 'default'),
      value: ensureNumber(link?.value || 1),
      color: ensureString(link?.color || '#8b8b8b'),
      ...link
    };
  });
  
  return {
    nodes: processedNodes,
    links: processedLinks
  };
}

/**
 * Creates safe props for graph renderers
 */
export function createSafeGraphProps(props: any = {}): any {
  return {
    width: ensureNumber(props.width, 600),
    height: ensureNumber(props.height, 400),
    zoom: ensureValidZoom(props.zoom),
    graphData: ensureValidGraphData(props.graphData),
    highlightedNodeId: nullToUndefined(props.highlightedNodeId),
    onNodeClick: typeof props.onNodeClick === 'function' ? props.onNodeClick : undefined,
    onLinkClick: typeof props.onLinkClick === 'function' ? props.onLinkClick : undefined
  };
}

/**
 * Safely wrap a callback to handle null/undefined
 */
export function safeCallback<T extends (...args: any[]) => any>(callback: T | undefined | null): T | ((...args: Parameters<T>) => void) {
  return typeof callback === 'function' ? callback : () => {};
}
