
/**
 * Type compatibility utilities for standardizing nullability and optionality
 * 
 * This file provides utility functions to handle type compatibility issues between
 * different parts of the application, especially dealing with null vs undefined.
 */

/**
 * Convert undefined to null - useful for database operations where null is expected
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Convert null to undefined - useful for UI components where undefined is expected
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensure a value is a string, with consistent null handling
 */
export function ensureStringNull(value: string | null | undefined): string | null {
  return value === undefined ? null : value;
}

/**
 * Ensure a value is a number, with consistent null handling
 */
export function ensureNumberNull(value: number | null | undefined): number | null {
  if (typeof value === 'number') {
    return value;
  }
  return null;
}

/**
 * Ensure a value is a boolean, with consistent null handling
 */
export function ensureBooleanNull(value: boolean | null | undefined): boolean | null {
  if (value === true || value === false) {
    return value;
  }
  return null;
}

/**
 * Ensure a value is an array, with consistent null handling
 */
export function ensureArrayNull<T>(value: T[] | null | undefined): T[] | null {
  if (Array.isArray(value)) {
    return value;
  }
  return null;
}

/**
 * Ensure a value is a string, defaulting to empty string
 */
export function ensureString(value: string | null | undefined): string {
  return value ?? "";
}

/**
 * Ensure a value is a number, defaulting to 0
 */
export function ensureNumber(value: number | null | undefined): number {
  return value ?? 0;
}

/**
 * Ensure a value is a boolean, defaulting to false
 */
export function ensureBoolean(value: boolean | null | undefined): boolean {
  return value ?? false;
}

/**
 * Ensure a value is an array, defaulting to empty array
 */
export function ensureArray<T>(value: T[] | null | undefined): T[] {
  return value ?? [];
}

/**
 * Safe callback function invocation with null/undefined handling
 */
export function safeCallback<T extends (...args: any[]) => any>(
  fn: T | null | undefined,
  defaultValue?: ReturnType<T>
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  return (...args: Parameters<T>) => {
    if (typeof fn === 'function') {
      return fn(...args);
    }
    return defaultValue;
  };
}

/**
 * Type guard to check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Safe object access with null/undefined handling
 */
export function safeAccess<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | null {
  if (obj == null) {
    return null;
  }
  return obj[key];
}

/**
 * Create a default object when the input is null or undefined
 */
export function defaultObject<T extends object>(obj: T | null | undefined, defaultValue: T): T {
  return obj ?? defaultValue;
}
