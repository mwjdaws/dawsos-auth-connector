
/**
 * Utility functions for type compatibility
 */

/**
 * Converts undefined to null
 * 
 * This is useful for API parameters that accept null but not undefined
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Converts null to undefined
 * 
 * This is useful for components that expect undefined instead of null
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensures a value is defined (not null or undefined)
 * 
 * @param value The value to check
 * @param defaultValue The default value to use if the input is null/undefined
 * @returns The value or default value
 */
export function ensureDefined<T>(value: T | null | undefined, defaultValue: T): T {
  return value === null || value === undefined ? defaultValue : value;
}

/**
 * Ensures a string value is defined, or empty string if not
 */
export function ensureString(value: string | null | undefined): string {
  return value ?? '';
}

/**
 * Ensures a number value is defined, or 0 if not
 */
export function ensureNumber(value: number | null | undefined): number {
  return value ?? 0;
}

/**
 * Ensures a boolean value is defined, or false if not
 */
export function ensureBoolean(value: boolean | null | undefined): boolean {
  return value ?? false;
}

/**
 * Safely converts a value to a specific type or returns null
 */
export function safelyConvert<T, R>(value: T | null | undefined, converter: (val: T) => R): R | null {
  if (value === null || value === undefined) {
    return null;
  }
  try {
    return converter(value);
  } catch (e) {
    return null;
  }
}
