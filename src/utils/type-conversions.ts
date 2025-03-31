
/**
 * Type conversion utilities for standardizing null/undefined handling
 * 
 * This file provides utilities for converting between null and undefined
 * to ensure consistency across the application. Database fields are typically
 * null while UI components often work with undefined.
 */

/**
 * Convert undefined to null - useful for database operations where null is expected
 * @param value Value that might be undefined
 * @returns The value or null if it was undefined
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Convert null to undefined - useful for UI components where undefined is expected
 * @param value Value that might be null
 * @returns The value or undefined if it was null
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensure a value is a string, with consistent null handling
 * @param value Value to convert
 * @returns String or null
 */
export function ensureStringNull(value: string | null | undefined): string | null {
  if (value === undefined) return null;
  if (value === null) return null;
  return String(value);
}

/**
 * Ensure a value is a number, with consistent null handling
 * @param value Value to convert
 * @returns Number or null
 */
export function ensureNumberNull(value: number | null | undefined): number | null {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value !== 'number' || isNaN(value)) return null;
  return value;
}

/**
 * Ensure a value is a boolean, with consistent null handling
 * @param value Value to convert
 * @returns Boolean or null
 */
export function ensureBooleanNull(value: boolean | null | undefined): boolean | null {
  if (value === undefined) return null;
  if (value === null) return null;
  return Boolean(value);
}

/**
 * Ensure a value is an array, with consistent null handling
 * @param value Value to convert
 * @returns Array or null
 */
export function ensureArrayNull<T>(value: T[] | null | undefined): T[] | null {
  if (value === undefined) return null;
  if (value === null) return null;
  if (!Array.isArray(value)) return null;
  return value;
}

/**
 * Ensure a value is a string, defaulting to empty string
 * @param value Value to convert
 * @returns String (never null/undefined)
 */
export function ensureString(value: string | null | undefined): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

/**
 * Ensure a value is a number, defaulting to 0
 * @param value Value to convert
 * @returns Number (never null/undefined)
 */
export function ensureNumber(value: number | null | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value !== 'number' || isNaN(value)) return 0;
  return value;
}

/**
 * Ensure a value is a boolean, defaulting to false
 * @param value Value to convert
 * @returns Boolean (never null/undefined)
 */
export function ensureBoolean(value: boolean | null | undefined): boolean {
  if (value === undefined || value === null) return false;
  return Boolean(value);
}

/**
 * Ensure a value is an array, defaulting to empty array
 * @param value Value to convert
 * @returns Array (never null/undefined)
 */
export function ensureArray<T>(value: T[] | null | undefined): T[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) return [];
  return value;
}

/**
 * Ensure a value is a Date, with consistent null handling
 * @param value Value to convert
 * @returns Date or null
 */
export function ensureDateNull(value: Date | string | number | null | undefined): Date | null {
  if (value === undefined || value === null) return null;
  
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Type guard to check if a value is defined (not null or undefined)
 * @param value Value to check
 * @returns True if the value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Safe callback function invocation with null/undefined handling
 * @param fn Function to call
 * @param args Arguments to pass to the function
 * @returns Result of the function or undefined
 */
export function safeCallback<T extends (...args: any[]) => any>(
  fn: T | null | undefined,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  return typeof fn === 'function' ? fn(...args) : undefined;
}

/**
 * Safely access a property of an object with null/undefined handling
 * @param obj Object to access
 * @param key Key to access
 * @returns Value at the key or null
 */
export function safeAccess<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | null {
  if (obj == null) {
    return null;
  }
  return obj[key];
}

/**
 * Create a default object when the input is null or undefined
 * @param obj Object to check
 * @param defaultValue Default value to use
 * @returns Original object or default
 */
export function defaultObject<T extends object>(obj: T | null | undefined, defaultValue: T): T {
  return obj ?? defaultValue;
}
