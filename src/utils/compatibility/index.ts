
/**
 * Type Compatibility Layer
 * 
 * This module provides utilities to handle type compatibility issues between
 * different parts of the application, especially for nullable/undefined values.
 */

/**
 * Ensures a value is a string, never undefined or null
 */
export function ensureString(value: string | null | undefined): string {
  return value || '';
}

/**
 * Ensures a value is a number, never undefined or null
 */
export function ensureNumber(value: number | null | undefined): number {
  return typeof value === 'number' ? value : 0;
}

/**
 * Ensures a boolean value, never undefined or null
 */
export function ensureBoolean(value: boolean | null | undefined): boolean {
  return value === true;
}

/**
 * Ensures an array is never undefined or null
 */
export function ensureArray<T>(value: T[] | null | undefined): T[] {
  return value || [];
}

/**
 * Ensures a value is either the provided value or null (not undefined)
 */
export function ensureNullable<T>(value: T | null | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Creates a fallback object for when an object might be undefined
 */
export function ensureObject<T extends object>(value: T | null | undefined, fallback: T): T {
  return value || fallback;
}

/**
 * Safely access a property that might be undefined
 */
export function safelyAccessProperty<T, K extends keyof T>(obj: T | null | undefined, property: K): T[K] | undefined {
  return obj ? obj[property] : undefined;
}

/**
 * Creates a safe function that won't throw if the function is undefined
 */
export function createSafeFunction<T extends (...args: any[]) => any>(fn: T | undefined | null): T {
  return ((...args: any[]) => {
    if (typeof fn === 'function') {
      return fn(...args);
    }
    return undefined;
  }) as T;
}

/**
 * Type guard to check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Ensures an ID value is always a string (for IDs that might be nullable)
 */
export function ensureId(id: string | null | undefined): string {
  return id || '';
}

/**
 * Type compatibility for error handling options
 */
export interface ErrorHandlingCompatOptions {
  level?: string;
  context?: Record<string, any>;
  silent?: boolean;
  technical?: boolean;
  title?: string;
  actionLabel?: string;
  onRetry?: () => void;
  preventDuplicate?: boolean;
  duration?: number;
  deduplicate?: boolean;
  action?: any; // For backward compatibility
}
