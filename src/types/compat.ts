
/**
 * Type compatibility utilities
 * 
 * These functions help maintain compatibility between different type systems,
 * especially when dealing with database values (which use null) and TypeScript
 * values (which often use undefined).
 */

/**
 * Convert an undefined value to null
 * Useful when sending data to APIs or databases that expect null
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Convert a null value to undefined
 * Useful when working with React components that expect undefined
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
