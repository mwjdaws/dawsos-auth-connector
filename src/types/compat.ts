
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

/**
 * Ensure a value is non-null (prefers the value if not null/undefined, otherwise uses default)
 */
export function ensureNonNull<T>(value: T | null | undefined, defaultValue: T): T {
  return (value !== null && value !== undefined) ? value : defaultValue;
}

/**
 * Safely convert undefined to null for APIs that require null
 */
export function undefinedToNullSafe<T>(value: T | null | undefined): T | null {
  if (value === undefined) return null;
  return value;
}

/**
 * Fixes the 'user_id: string | undefined' to 'string | null' conversion errors
 */
export function userIdCompat(userId: string | undefined): string | null {
  return userId === undefined ? null : userId;
}

/**
 * Provides a default string value, useful for handling external data
 */
export function defaultString(value: string | null | undefined, defaultValue: string = ''): string {
  return value ?? defaultValue;
}

/**
 * Ensures a value is coerced to a string
 */
export function asString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Forces a value to string or null, never undefined
 */
export function stringOrNull(value: string | null | undefined): string | null {
  return value === undefined ? null : value;
}
