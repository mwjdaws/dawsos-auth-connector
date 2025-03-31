
/**
 * Compatibility utilities for handling type differences
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
 * Convert a null or undefined value to a default value
 */
export function nullOrUndefinedToDefault<T>(value: T | null | undefined, defaultValue: T): T {
  return (value === null || value === undefined) ? defaultValue : value;
}

/**
 * Check if a value is null or undefined
 */
export function isNullOrUndefined(value: any): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Ensure a value is not null or undefined, using a default value if it is
 */
export function ensureValue<T>(value: T | null | undefined, defaultValue: T): T {
  return isNullOrUndefined(value) ? defaultValue : value;
}

/**
 * Ensures a value is a string
 */
export function ensureString(value: any, defaultValue = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  return defaultValue;
}

/**
 * Ensures a value is a number
 */
export function ensureNumber(value: any, defaultValue = 0): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  return defaultValue;
}

/**
 * Ensures a value is a boolean
 */
export function ensureBoolean(value: any, defaultValue = false): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  return defaultValue;
}

/**
 * Safe callback function invocation with null/undefined handling
 * 
 * Returns a function that will call the original function if it exists,
 * or return the provided default value if the function is null/undefined.
 */
export function safeCallback<T extends (...args: any[]) => any>(
  fn: T | null | undefined,
  defaultValue?: ReturnType<T>
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    if (typeof fn === 'function') {
      return fn(...args);
    }
    return defaultValue;
  };
}
