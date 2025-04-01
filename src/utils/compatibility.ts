
/**
 * Utility functions for ensuring compatibility across components
 */

/**
 * Ensures a value is a string, providing an empty string fallback
 */
export const ensureString = (value: string | null | undefined): string => {
  return value || '';
};

/**
 * Ensures a value is a number, providing a fallback
 */
export const ensureNumber = (value: number | null | undefined, fallback = 0): number => {
  return typeof value === 'number' ? value : fallback;
};

/**
 * Ensures a value is a boolean, providing a fallback
 */
export const ensureBoolean = (value: boolean | null | undefined, fallback = false): boolean => {
  return typeof value === 'boolean' ? value : fallback;
};

/**
 * Ensures a zoom level is within valid range
 */
export const ensureValidZoom = (zoom: number | undefined, min = 0.1, max = 5): number => {
  const safeZoom = typeof zoom === 'number' ? zoom : 1;
  return Math.min(Math.max(safeZoom, min), max);
};

/**
 * Ensures the graph data is valid, providing empty arrays as fallbacks
 */
export const ensureValidGraphData = (data: any): { nodes: any[]; links: any[] } => {
  if (!data) return { nodes: [], links: [] };
  return {
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    links: Array.isArray(data.links) ? data.links : []
  };
};

/**
 * Creates safe props for graph components
 */
export const createSafeGraphProps = (props: any) => {
  return {
    startingNodeId: ensureString(props.startingNodeId),
    width: ensureNumber(props.width, 800),
    height: ensureNumber(props.height, 600),
    hasAttemptedRetry: ensureBoolean(props.hasAttemptedRetry, false)
  };
};

/**
 * Helper function for safely invoking callbacks
 */
export const safeCallback = <T extends (...args: any[]) => any>(
  callback: T | undefined,
  ...args: Parameters<T>
): ReturnType<T> | undefined => {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return undefined;
};

/**
 * Sanitizes graph data to ensure all required fields are present
 */
export const sanitizeGraphData = (data: any) => {
  if (!data) return { nodes: [], links: [] };
  
  const sanitizedNodes = Array.isArray(data.nodes) 
    ? data.nodes.map((node: any) => ({
        id: ensureString(node.id),
        name: node.name || node.title || node.id || 'Unnamed',
        type: node.type || 'unknown',
        ...node
      }))
    : [];
    
  const sanitizedLinks = Array.isArray(data.links) 
    ? data.links.map((link: any) => ({
        source: typeof link.source === 'object' ? link.source.id : String(link.source || ''),
        target: typeof link.target === 'object' ? link.target.id : String(link.target || ''),
        type: link.type || 'unknown',
        ...link
      }))
    : [];
    
  return {
    nodes: sanitizedNodes,
    links: sanitizedLinks
  };
};
