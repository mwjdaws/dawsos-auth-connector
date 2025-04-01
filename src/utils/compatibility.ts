
/**
 * Compatibility utilities for handling nullable types and validations
 */

/**
 * Ensures a value is a string
 */
export function ensureString(value: string | null | undefined): string {
  return value ?? '';
}

/**
 * Ensures a value is a number
 */
export function ensureNumber(value: number | null | undefined): number {
  return value ?? 0;
}

/**
 * Ensures a value is a boolean
 */
export function ensureBoolean(value: boolean | null | undefined): boolean {
  return value ?? false;
}

/**
 * Validates that a zoom level is within acceptable range
 */
export function ensureValidZoom(value: number | null | undefined): number {
  const zoom = value ?? 1;
  return Math.max(0.1, Math.min(3, zoom));
}

/**
 * Ensures graph data is in the correct format
 */
export function ensureValidGraphData(data: any): { nodes: any[]; links: any[] } {
  if (!data) return { nodes: [], links: [] };
  
  return {
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    links: Array.isArray(data.links) ? data.links : []
  };
}

/**
 * Sanitizes graph data to ensure required properties
 */
export function sanitizeGraphData(data: any): { nodes: any[]; links: any[] } {
  const validData = ensureValidGraphData(data);
  
  return {
    nodes: validData.nodes.map(node => ({
      id: ensureString(node.id),
      name: ensureString(node.name),
      title: ensureString(node.title),
      ...node
    })),
    links: validData.links.map(link => ({
      source: ensureString(link.source),
      target: ensureString(link.target),
      ...link
    }))
  };
}

/**
 * Creates safe graph props with defaults for null values
 */
export function createSafeGraphProps(props: any) {
  return {
    width: ensureNumber(props.width),
    height: ensureNumber(props.height),
    zoomLevel: ensureValidZoom(props.zoomLevel),
    highlightedNodeId: ensureString(props.highlightedNodeId),
    graphData: ensureValidGraphData(props.graphData)
  };
}
