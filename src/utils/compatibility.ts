
import { ErrorHandlingOptions } from './errors/types';
import { convertErrorOptions, compatibleErrorOptions, LegacyErrorHandlingOptions } from './errors/compatibility';

/**
 * Utility functions for type compatibility and conversions
 */
import React from 'react';

// Re-export error compatibility helpers
export { convertErrorOptions, compatibleErrorOptions };
export type { LegacyErrorHandlingOptions };

/**
 * Ensures a value is a string
 * 
 * @param value The value to check/convert
 * @param defaultValue Optional default value if conversion fails
 * @returns The value as a string, or the default value
 */
export function ensureString(value: unknown, defaultValue: string = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  return String(value);
}

/**
 * Ensures a value is a number
 * 
 * @param value The value to check/convert
 * @param defaultValue Optional default value if conversion fails
 * @returns The value as a number, or the default value
 */
export function ensureNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Ensures a value is a boolean
 * 
 * @param value The value to check/convert
 * @param defaultValue Optional default value if conversion fails
 * @returns The value as a boolean, or the default value
 */
export function ensureBoolean(value: unknown, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  
  if (typeof value === 'number') {
    return value !== 0;
  }
  
  return defaultValue;
}

/**
 * Safely calls a callback function
 * 
 * @param callback The callback function to call
 * @param args Arguments to pass to the callback
 * @returns The result of the callback, or undefined if the callback is not a function
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | null | undefined,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return undefined;
}

/**
 * Creates a no-op function that can be used as a safe default
 * 
 * @returns A function that does nothing
 */
export function noOp(): () => void {
  return () => {};
}

// Instead of using JSX in a .ts file, we'll implement a simpler version
// that does not use JSX directly
export type SafeRenderProps = {
  children: React.ReactNode;
};

/**
 * Safe wrapper for potentially undefined/null children
 * This is a type-only definition since we can't use JSX in .ts files
 */
export const SafeRender = (props: SafeRenderProps): JSX.Element | null => {
  // The actual implementation will be in a .tsx file
  // This is just a placeholder to maintain the type signature
  return null;
};

// Additional graph data utilities for RelationshipGraph components
export function sanitizeGraphData(data: any): any {
  if (!data) return { nodes: [], links: [] };
  return {
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    links: Array.isArray(data.links) ? data.links : []
  };
}

export function ensureValidZoom(zoom: unknown): number {
  const parsedZoom = ensureNumber(zoom, 1);
  return Math.min(Math.max(0.1, parsedZoom), 5);
}

export function ensureValidGraphData(data: any): { nodes: any[], links: any[] } {
  return {
    nodes: Array.isArray(data?.nodes) ? data.nodes : [],
    links: Array.isArray(data?.links) ? data.links : []
  };
}

export function createSafeGraphProps(props: any): any {
  return {
    width: ensureNumber(props?.width, 800),
    height: ensureNumber(props?.height, 600),
    nodeSize: ensureNumber(props?.nodeSize, 16),
    linkDistance: ensureNumber(props?.linkDistance, 100),
    chargeStrength: ensureNumber(props?.chargeStrength, -30),
    centerForce: ensureNumber(props?.centerForce, 0.1),
    enableDrag: ensureBoolean(props?.enableDrag, true),
    enableZoom: ensureBoolean(props?.enableZoom, true),
    highlightDegree: ensureNumber(props?.highlightDegree, 1),
    data: ensureValidGraphData(props?.data)
  };
}
