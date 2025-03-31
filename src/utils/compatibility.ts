
/**
 * General compatibility utilities
 * 
 * These functions help maintain consistent behavior by providing safe
 * conversions between different value types (string/null/undefined).
 */

/**
 * Ensures a value is a string, or a default value
 * 
 * @param value - The value to check
 * @param defaultValue - The default value to return if value is null or undefined
 * @returns A string that's never null or undefined
 */
export function ensureString(value: string | null | undefined, defaultValue = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value);
}

/**
 * Ensures a value is a number, or a default value
 * 
 * @param value - The value to check
 * @param defaultValue - The default value to return if value is not a valid number
 * @returns A number that's never NaN, null, or undefined
 */
export function ensureNumber(value: number | null | undefined, defaultValue = 0): number {
  if (value === null || value === undefined || isNaN(value)) {
    return defaultValue;
  }
  return Number(value);
}

/**
 * Ensures a value is a boolean, or a default value
 * 
 * @param value - The value to check
 * @param defaultValue - The default value to return if value is null or undefined
 * @returns A boolean that's never null or undefined
 */
export function ensureBoolean(value: boolean | null | undefined, defaultValue = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return Boolean(value);
}

/**
 * Converts null to undefined
 * 
 * @param value - The value to convert
 * @returns The original value, or undefined if value was null
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Converts undefined to null
 * 
 * @param value - The value to convert
 * @returns The original value, or null if value was undefined
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Safely calls a callback function if it exists
 * 
 * @param callback - The callback to call
 * @param fallback - The fallback function to call if callback is undefined
 * @returns A function that will call callback if it exists, or fallback otherwise
 */
export function safeCallback<T extends any[], R>(
  callback: ((...args: T) => R) | undefined | null,
  fallback: (...args: T) => R
): (...args: T) => R {
  return (...args: T) => {
    if (typeof callback === 'function') {
      return callback(...args);
    }
    return fallback(...args);
  };
}
