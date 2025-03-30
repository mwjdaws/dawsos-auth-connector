
/**
 * Type compatibility utilities for handling null/undefined across the codebase
 * 
 * This file provides standardized type conversion functions to ensure consistent
 * handling of null/undefined values throughout the application.
 */

/**
 * Convert undefined to null for API compatibility
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Convert null to undefined for component compatibility
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensure a value is a string, converting null/undefined to empty string
 */
export function ensureString(value: string | null | undefined): string {
  return value ?? '';
}

/**
 * Ensure a value is non-null by providing a default value
 */
export function withDefault<T>(value: T | null | undefined, defaultValue: T): T {
  return (value === null || value === undefined) ? defaultValue : value;
}

/**
 * Create a safe wrapper for an optional callback function
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined,
  fallback?: ReturnType<T>
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (callback) {
      return callback(...args);
    }
    return fallback as ReturnType<T>;
  }) as T;
}

/**
 * Utility for safely handling props with optional callbacks
 */
export function withOptionalCallback<T extends Record<string, any>, K extends keyof T>(
  props: T,
  callbackKey: K,
  fallback?: ReturnType<T[K]>
): T {
  if (props[callbackKey] === undefined) {
    return {
      ...props,
      [callbackKey]: (...args: any[]) => fallback
    };
  }
  return props;
}

/**
 * Type guard for checking if a value is not null or undefined
 */
export function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
