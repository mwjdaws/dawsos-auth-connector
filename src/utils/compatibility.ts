
/**
 * Compatibility utilities for working with different data types
 * These ensure type safety by handling null and undefined values appropriately
 */

/**
 * Ensures that a value is a string, providing a default if undefined or null
 */
export function ensureString(value: string | null | undefined, defaultValue: string = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return value;
}

/**
 * Ensures that a value is a number, providing a default if undefined, null or NaN
 */
export function ensureNumber(value: number | null | undefined, defaultValue: number = 0): number {
  if (value === null || value === undefined || isNaN(value)) {
    return defaultValue;
  }
  return value;
}

/**
 * Ensures that a value is a boolean, providing a default if undefined or null
 */
export function ensureBoolean(value: boolean | null | undefined, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return value;
}

/**
 * Ensures that a zoom level is within valid bounds (typically 0.1 to 2.0)
 */
export function ensureValidZoom(zoom: number | null | undefined, defaultZoom: number = 1): number {
  const value = ensureNumber(zoom, defaultZoom);
  return Math.max(0.1, Math.min(2.0, value));
}

/**
 * Ensures that graph data contains valid nodes and links arrays
 */
export function ensureValidGraphData(data: any): { nodes: any[]; links: any[] } {
  if (!data) {
    return { nodes: [], links: [] };
  }

  return {
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    links: Array.isArray(data.links) ? data.links : []
  };
}

/**
 * Sanitizes graph data to ensure all required properties exist
 */
export function sanitizeGraphData(data: any): { nodes: any[]; links: any[] } {
  const validData = ensureValidGraphData(data);
  
  // Ensure all nodes have required properties
  const nodes = validData.nodes.map(node => ({
    id: ensureString(node.id),
    name: ensureString(node.name || node.title),
    type: ensureString(node.type, 'default'),
    ...node
  }));
  
  // Ensure all links have required properties
  const links = validData.links.map(link => ({
    source: link.source,
    target: link.target,
    type: ensureString(link.type, 'default'),
    ...link
  }));
  
  return { nodes, links };
}

/**
 * Creates a compatible graph ref object with all necessary methods
 */
export function createCompatibleGraphRef() {
  return {
    centerOn: (nodeId: string) => console.log(`Center on node ${nodeId}`),
    setZoom: (zoom: number) => console.log(`Set zoom to ${zoom}`),
    getNodeAt: (x: number, y: number) => null,
    zoomToFit: (duration: number = 1000) => console.log(`Zoom to fit with duration ${duration}`)
  };
}

/**
 * Creates safe props for graph components with appropriate defaults
 */
export function createSafeGraphProps(props: any = {}) {
  return {
    width: ensureNumber(props.width, 800),
    height: ensureNumber(props.height, 600),
    graphData: sanitizeGraphData(props.graphData),
    nodeSize: ensureNumber(props.nodeSize, 5),
    linkWidth: ensureNumber(props.linkWidth, 1),
    ...props
  };
}
