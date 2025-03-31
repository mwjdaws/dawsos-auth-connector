
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
