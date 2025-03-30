
/**
 * Type compatibility helpers for working with null vs. undefined
 */

/**
 * Converts undefined to null
 * Useful for APIs that expect null values rather than undefined
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Converts null to undefined
 * Useful for APIs that expect undefined values rather than null
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensures a value is a string, with empty string fallback
 */
export function ensureString(value: string | null | undefined): string {
  return value || '';
}

/**
 * Safely invoke a callback with fallback if it's undefined
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined | null,
  defaultValue?: ReturnType<T>
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (callback) {
      return callback(...args);
    }
    return defaultValue as ReturnType<T>;
  }) as T;
}
