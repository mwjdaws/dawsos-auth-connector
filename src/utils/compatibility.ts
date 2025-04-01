
/**
 * Compatibility utilities for handling type safety across the application
 */

// Value type guards
export function ensureString(value: any): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return String(value);
}

export function ensureNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (value === null || value === undefined) return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

export function ensureBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  return Boolean(value);
}

// Null/undefined handling
export function ensureValidZoom(zoom: any): number {
  const parsed = ensureNumber(zoom);
  return parsed <= 0 ? 1 : parsed > 10 ? 10 : parsed;
}

// Prop validation
export function createSafeGraphProps(props: any): any {
  return {
    ...props,
    onNodeClick: props.onNodeClick || undefined,
    onLinkClick: props.onLinkClick || undefined,
    highlightedNodeId: props.highlightedNodeId || null,
    width: ensureNumber(props.width) || 800,
    height: ensureNumber(props.height) || 600,
    zoom: ensureValidZoom(props.zoom) || 1
  };
}

// Safe callback executor
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return undefined;
}

// Graph data validation
export function ensureValidGraphData(graphData: any): { nodes: any[]; links: any[] } {
  if (!graphData) return { nodes: [], links: [] };
  return {
    nodes: Array.isArray(graphData.nodes) ? graphData.nodes : [],
    links: Array.isArray(graphData.links) ? graphData.links : []
  };
}

export function sanitizeGraphData(graphData: any): { nodes: any[]; links: any[] } {
  const safeData = ensureValidGraphData(graphData);
  
  return {
    nodes: safeData.nodes.map(node => ({
      id: ensureString(node.id),
      name: ensureString(node.name || node.title),
      title: ensureString(node.title),
      color: node.color || null,
      size: ensureNumber(node.size) || 15,
      ...node
    })),
    links: safeData.links.map(link => ({
      source: ensureString(link.source),
      target: ensureString(link.target),
      type: ensureString(link.type || 'default'),
      ...link
    }))
  };
}

// Type conversions
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

// Error handling compatibility
export function compatibleErrorOptions(options: any = {}): any {
  const safeOptions = { ...options };
  
  // Convert from new format to older format if needed
  if (safeOptions.level && !safeOptions.severity) {
    safeOptions.severity = safeOptions.level;
  }
  
  return safeOptions;
}
