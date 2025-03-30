
/**
 * Type Compatibility Utilities
 * 
 * This module provides utility functions to handle common type conversion
 * issues between null/undefined and to handle optional fields in a type-safe way.
 */

// Convert null to undefined
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

// Convert undefined to null
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

// Ensure a value is a string (converts null/undefined to empty string)
export function ensureString(value: string | null | undefined): string {
  return value ?? '';
}

// Ensure a value is a number (converts null/undefined to 0)
export function ensureNumber(value: number | null | undefined): number {
  return value ?? 0;
}

// Ensure a value is a boolean (converts null/undefined to false)
export function ensureBoolean(value: boolean | null | undefined): boolean {
  return value ?? false;
}

// Ensure an optional callback function exists (returns no-op function if undefined)
export function ensureCallback<T extends (...args: any[]) => any>(
  callback: T | undefined | null
): T {
  return callback as T || ((() => {}) as unknown as T);
}

// Handle optional validation result messages consistently
export function formatValidationMessage(message: string | null | undefined): string | null {
  return message || null;
}

// Convert a potentially null/undefined object to a valid object with all required fields
export function ensureCompleteObject<T extends object>(
  obj: Partial<T> | null | undefined,
  defaults: T
): T {
  if (!obj) return defaults;
  return { ...defaults, ...obj };
}

// Type guard to check if a value is defined (not null or undefined)
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// Creates a safe version of an object where undefined properties are converted to null
export function makeNullSafe<T extends object>(obj: T): { [K in keyof T]: T[K] | null } {
  if (!obj) return {} as { [K in keyof T]: T[K] | null };
  
  const result: any = {};
  for (const key in obj) {
    result[key] = obj[key] === undefined ? null : obj[key];
  }
  return result;
}

// Creates a safe version of an object where null properties are converted to undefined
export function makeUndefinedSafe<T extends object>(obj: T): { [K in keyof T]: T[K] | undefined } {
  if (!obj) return {} as { [K in keyof T]: T[K] | undefined };
  
  const result: any = {};
  for (const key in obj) {
    result[key] = obj[key] === null ? undefined : obj[key];
  }
  return result;
}
