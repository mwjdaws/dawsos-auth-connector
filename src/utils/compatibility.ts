
/**
 * Compatibility utilities for handling various data types and formats
 * to ensure consistent behavior across the application.
 */

/**
 * Options for error handling compatibility
 */
export interface ErrorHandlingCompatOptions {
  context?: Record<string, any>;
  silent?: boolean;
  technical?: boolean;
  title?: string;
  level?: 'debug' | 'info' | 'warning' | 'error';
  actionLabel?: string;
  onRetry?: () => void;
  preventDuplicate?: boolean;
  deduplicate?: boolean;
  duration?: number;
}

/**
 * Ensures a value is a string, with a default value if null/undefined
 */
export function ensureString(value: any, defaultValue: string = ''): string {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

/**
 * Ensures a value is a number, with a default value if null/undefined/NaN
 */
export function ensureNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Ensures a value is a boolean
 */
export function ensureBoolean(value: any, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) return defaultValue;
  return Boolean(value);
}

/**
 * Ensures a value is an array, with a default empty array if null/undefined
 */
export function ensureArray<T>(value: T[] | null | undefined, defaultValue: T[] = []): T[] {
  if (!Array.isArray(value)) return defaultValue;
  return value;
}

/**
 * Ensures a value is an object, with a default empty object if null/undefined
 */
export function ensureObject<T extends object>(value: T | null | undefined, defaultValue: T): T {
  if (value === null || value === undefined || typeof value !== 'object') return defaultValue;
  return value;
}

/**
 * Converts a value to a string | null type (useful for database fields)
 */
export function toNullableString(value: any): string | null {
  if (value === null || value === undefined) return null;
  return String(value);
}

/**
 * Converts a value to a number | null type (useful for database fields)
 */
export function toNullableNumber(value: any): number | null {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

/**
 * Safe type converter for string ID values that might be null/undefined
 */
export function safeId(id: string | null | undefined): string {
  return ensureString(id);
}
