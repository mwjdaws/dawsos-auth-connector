
/**
 * Compatibility utilities for handling various undefined/null scenarios
 * 
 * These utilities are designed to handle cases where a function expects a certain type
 * but might receive undefined or null, providing safe defaults.
 */

/**
 * Convert undefined to null for APIs that expect null
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Convert null to undefined for APIs that expect undefined
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensure a value is a string, with an empty string as fallback
 */
export function ensureString(value: string | null | undefined, defaultValue: string = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return value;
}

/**
 * Ensure a value is a number, with a default fallback
 */
export function ensureNumber(value: number | null | undefined, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return value;
}

/**
 * Ensure a value is a boolean, with a default fallback
 */
export function ensureBoolean(value: boolean | null | undefined, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return value;
}

/**
 * Helper for error handling compatibility
 */
export interface ErrorHandlingCompatOptions {
  title?: string;
  level?: 'info' | 'warning' | 'error';
  duration?: number;
  variant?: 'default' | 'destructive';
  context?: Record<string, any>;
}
