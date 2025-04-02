
/**
 * Type compatibility utilities
 * 
 * These functions provide safe handling of various data types to ensure
 * consistent behavior across the application.
 */

/**
 * Ensures a value is a string, or returns an empty string
 */
export function ensureString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

/**
 * Ensures a value is a number, or returns the default value
 */
export function ensureNumber(value: unknown, defaultValue = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Ensures a value is a boolean, or returns the default value
 */
export function ensureBoolean(value: unknown, defaultValue = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return Boolean(value);
}

/**
 * Ensures a value is an array, or returns an empty array
 */
export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }
  return [];
}

/**
 * Normalizes null or undefined to null
 */
export function normalizeToNull<T>(value: T | null | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Normalizes null or undefined to undefined
 */
export function normalizeToUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Converts undefined to null but preserves null values
 */
export function undefinedToNull<T>(value: T | undefined | null): T | null {
  return value === undefined ? null : value;
}

/**
 * Converts null to undefined but preserves undefined values
 */
export function nullToUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensures a value is not null or undefined, providing a default
 */
export function ensureValue<T>(value: T | null | undefined, defaultValue: T): T {
  return (value === null || value === undefined) ? defaultValue : value;
}

/**
 * Ensures a string is non-empty or returns null
 */
export function ensureNonEmptyString(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value.trim() === '') {
    return null;
  }
  return value;
}

/**
 * Graph data sanitization
 */
export function sanitizeGraphData(data: any): any {
  if (!data) return { nodes: [], links: [] };
  
  return {
    nodes: ensureArray(data.nodes).map(node => ({
      id: ensureString(node?.id),
      name: ensureString(node?.name),
      group: ensureNumber(node?.group, 1),
      size: ensureNumber(node?.size, 10),
      color: ensureString(node?.color)
    })),
    links: ensureArray(data.links).map(link => ({
      source: ensureString(link?.source),
      target: ensureString(link?.target),
      value: ensureNumber(link?.value, 1),
      label: ensureString(link?.label)
    }))
  };
}

/**
 * Ensures valid zoom level for graph
 */
export function ensureValidZoom(zoom: unknown): number {
  const zoomValue = ensureNumber(zoom, 1);
  return Math.min(Math.max(zoomValue, 0.1), 5); // limit between 0.1 and 5
}

/**
 * Ensures valid graph data
 */
export function ensureValidGraphData(data: any): { nodes: any[], links: any[] } {
  if (!data) return { nodes: [], links: [] };
  
  return {
    nodes: ensureArray(data.nodes),
    links: ensureArray(data.links)
  };
}

/**
 * Creates safe graph props
 */
export function createSafeGraphProps(props: any): any {
  return {
    width: ensureNumber(props?.width, 800),
    height: ensureNumber(props?.height, 600),
    graphData: ensureValidGraphData(props?.graphData),
    nodeSize: ensureNumber(props?.nodeSize, 5),
    linkWidth: ensureNumber(props?.linkWidth, 1),
    nodeColor: ensureString(props?.nodeColor || '#1f77b4'),
    linkColor: ensureString(props?.linkColor || '#999'),
    backgroundColor: ensureString(props?.backgroundColor || 'transparent')
  };
}

/**
 * Safe callback execution
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined | null,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (typeof callback === 'function') {
    try {
      return callback(...args);
    } catch (error) {
      console.error('Error in callback execution:', error);
    }
  }
  return undefined;
}
