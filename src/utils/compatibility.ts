
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './errors/types';

/**
 * Utility functions for backward compatibility
 */

/**
 * Convert error options from old format to new format
 */
export function convertErrorOptions(
  options?: Partial<ErrorHandlingOptions> | string | ErrorLevel
): Partial<ErrorHandlingOptions> {
  // If it's already in the correct format, return it
  if (options && typeof options === 'object') {
    const result: Partial<ErrorHandlingOptions> = { ...options };
    
    // Handle retryCount if present (move to context)
    if ('retryCount' in options) {
      result.context = {
        ...result.context,
        retryCount: options.retryCount
      };
      delete result.retryCount;
    }
    
    return result;
  }

  // Convert string to error message
  if (typeof options === 'string') {
    return {
      message: options,
      toastTitle: options
    };
  }

  // Convert ErrorLevel to level
  if (typeof options === 'number') {
    return {
      level: options as ErrorLevel
    };
  }

  // Return empty object for undefined
  return {};
}

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
 * Ensure a value is a number, converting null/undefined to 0
 */
export function ensureNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Ensure a value is a boolean, converting null/undefined to false
 */
export function ensureBoolean(value: any, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  return Boolean(value);
}

/**
 * Safely handle callback functions, avoiding errors if the callback is undefined
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined, 
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return undefined;
}

/**
 * Ensure a valid zoom level is used for graph visualization
 */
export function ensureValidZoom(zoom: any, min: number = 0.1, max: number = 4): number {
  const value = ensureNumber(zoom, 1);
  return Math.max(min, Math.min(max, value));
}

/**
 * Sanitize graph data for use in visualization components
 */
export function sanitizeGraphData(data: any) {
  if (!data) return { nodes: [], links: [] };
  
  const nodes = Array.isArray(data.nodes) ? data.nodes : [];
  const links = Array.isArray(data.links) ? data.links : [];
  
  return { 
    nodes: nodes.map(node => ({
      id: ensureString(node.id),
      x: ensureNumber(node.x, 0),
      y: ensureNumber(node.y, 0),
      color: node.color || '#6E59A5',
      size: ensureNumber(node.size, 10),
      ...node
    })),
    links 
  };
}

/**
 * Ensure valid graph data structure
 */
export function ensureValidGraphData(data: any) {
  if (!data) return { nodes: [], links: [] };
  if (!Array.isArray(data.nodes)) return { nodes: [], links: [] };
  if (!Array.isArray(data.links)) return { nodes: data.nodes, links: [] };
  
  return data;
}

/**
 * Create safe graph props by sanitizing inputs
 */
export function createSafeGraphProps(props: any) {
  return {
    data: sanitizeGraphData(props.data),
    width: ensureNumber(props.width, 800),
    height: ensureNumber(props.height, 600),
    zoom: ensureValidZoom(props.zoom),
    ...props
  };
}

// Add other compatibility utilities as needed
