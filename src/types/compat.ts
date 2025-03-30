
/**
 * Type compatibility utilities
 */

/**
 * Converts undefined to null, useful for API compatibility
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Converts null to undefined, useful for component props compatibility
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensures a value is not undefined by providing a default
 */
export function withDefault<T>(value: T | undefined, defaultValue: T): T {
  return value === undefined ? defaultValue : value;
}

/**
 * Safe type cast for compatibility with older API responses
 */
export function safeTypecast<T, U>(value: T, fallback: U): T | U {
  return value !== undefined && value !== null ? value : fallback;
}
