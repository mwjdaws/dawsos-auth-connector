
/**
 * Utility functions for compatibility across the application
 */

// Import types from graph component
import { GraphNode, GraphLink, GraphData } from '@/components/MarkdownViewer/RelationshipGraph/types';

/**
 * Sanitizes and validates graph data to ensure it's in the correct format
 * 
 * @param data The graph data to sanitize
 * @returns A cleaned version of the graph data
 */
export function sanitizeGraphData(data: any): GraphData {
  if (!data || typeof data !== 'object') {
    return { nodes: [], links: [] };
  }
  
  const sanitizedData: GraphData = {
    nodes: Array.isArray(data.nodes) ? data.nodes.map(adaptGraphNode) : [],
    links: Array.isArray(data.links) ? data.links.map(adaptGraphLink) : []
  };
  
  return sanitizedData;
}

/**
 * Adapts a node object to ensure it has all required fields
 */
function adaptGraphNode(node: any): GraphNode {
  if (!node || typeof node !== 'object') {
    return { id: 'unknown', name: 'Unknown Node' };
  }
  
  return {
    ...node,
    id: node.id || 'unknown',
    name: node.name || node.title || node.id || 'Unknown',
    title: node.title || node.name || node.id
  };
}

/**
 * Adapts a link object to ensure it has all required fields
 */
function adaptGraphLink(link: any): GraphLink {
  if (!link || typeof link !== 'object') {
    return { source: 'unknown', target: 'unknown' };
  }
  
  const source = typeof link.source === 'object' ? link.source.id : link.source;
  const target = typeof link.target === 'object' ? link.target.id : link.target;
  
  return {
    ...link,
    source,
    target
  };
}

/**
 * Safely calls a callback function if it exists
 * 
 * @param callback The callback function to call
 * @param defaultFn A default function to call if the callback is null or undefined
 * @param args Arguments to pass to the callback
 * @returns The result of the callback or default function
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | null | undefined,
  defaultFn: (...args: Parameters<T>) => ReturnType<T>,
  ...args: Parameters<T>
): ReturnType<T> {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return defaultFn(...args);
}

/**
 * Convert null to undefined
 * 
 * @param value The value to convert
 * @returns undefined if the value is null, otherwise the value
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Convert undefined to null
 * 
 * @param value The value to convert
 * @returns null if the value is undefined, otherwise the value
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Ensures a value is a string
 * 
 * @param value The value to check
 * @param defaultValue The default value to use if the value is not a string
 * @returns The value as a string or the default value
 */
export function ensureString(value: any, defaultValue = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  return defaultValue;
}

/**
 * Ensures a value is a number
 * 
 * @param value The value to check
 * @param defaultValue The default value to use if the value is not a number
 * @returns The value as a number or the default value
 */
export function ensureNumber(value: any, defaultValue = 0): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  return defaultValue;
}

/**
 * Ensures a value is a boolean
 * 
 * @param value The value to check
 * @param defaultValue The default value to use if the value is not a boolean
 * @returns The value as a boolean or the default value
 */
export function ensureBoolean(value: any, defaultValue = false): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  return defaultValue;
}

/**
 * Ensures a value is an object
 * 
 * @param value The value to check
 * @param defaultValue The default value to use if the value is not an object
 * @returns The value as an object or the default value
 */
export function ensureObject<T extends object>(value: any, defaultValue: T): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as T;
  }
  return defaultValue;
}
