
/**
 * Type compatibility and conversion utilities
 * 
 * This module provides utilities for ensuring type safety when working with
 * potentially inconsistent or external data. It helps sanitize and normalize data
 * to prevent runtime errors.
 */

// String conversions
export function ensureString(value: any, defaultValue: string = ''): string {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

// Number conversions
export function ensureNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

// Boolean conversions
export function ensureBoolean(value: any, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) return defaultValue;
  return Boolean(value);
}

// Array conversions
export function ensureArray<T>(value: any, defaultValue: T[] = []): T[] {
  if (Array.isArray(value)) return value;
  return defaultValue;
}

// Null/Undefined conversions
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

// Graph data sanitization
export function sanitizeGraphData(data: any): any {
  if (!data || typeof data !== 'object') return { nodes: [], links: [] };
  
  const sanitizedData = {
    nodes: ensureArray(data.nodes).map((node: any) => ({
      id: ensureString(node?.id),
      name: ensureString(node?.name || node?.title),
      title: ensureString(node?.title || node?.name),
      ...node
    })),
    links: ensureArray(data.links).map((link: any) => ({
      source: ensureString(typeof link?.source === 'object' ? link?.source?.id : link?.source),
      target: ensureString(typeof link?.target === 'object' ? link?.target?.id : link?.target),
      ...link
    }))
  };
  
  return sanitizedData;
}

// Graph validation
export function ensureValidZoom(zoom: any): number {
  const validZoom = ensureNumber(zoom, 1);
  return Math.max(0.1, Math.min(validZoom, 4));
}

export function ensureValidGraphData(data: any): any {
  return data && typeof data === 'object' && (data.nodes || data.links)
    ? sanitizeGraphData(data)
    : { nodes: [], links: [] };
}

// Safe property access and callback handling
export function createSafeGraphProps(props: any): any {
  return {
    graphData: ensureValidGraphData(props?.graphData),
    width: ensureNumber(props?.width, 800),
    height: ensureNumber(props?.height, 600),
    zoom: ensureValidZoom(props?.zoom),
    highlightedNodeId: props?.highlightedNodeId || null
  };
}

export function safeCallback<T extends Function>(callback: T | undefined): T | ((...args: any[]) => void) {
  return typeof callback === 'function' ? callback : () => {};
}

