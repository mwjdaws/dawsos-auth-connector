
/**
 * Type compatibility utilities
 *
 * These utilities help handle type conversions and compatibility
 * between different parts of the application, especially when
 * dealing with optional, nullable, or potentially undefined values.
 */

/**
 * Convert undefined to null
 * @param value The value to convert
 * @returns The value, or null if undefined
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Convert null to undefined
 * @param value The value to convert
 * @returns The value, or undefined if null
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensure a value is a string, even if null or undefined
 * @param value The value to convert
 * @returns The string value, or empty string if null or undefined
 */
export function ensureString(value: string | null | undefined): string {
  return value ?? '';
}

/**
 * Ensure a value is a number, even if null or undefined
 * @param value The value to convert
 * @returns The number value, or 0 if null or undefined
 */
export function ensureNumber(value: number | null | undefined): number {
  return value ?? 0;
}

/**
 * Ensure a value is a boolean, even if null or undefined
 * @param value The value to convert
 * @returns The boolean value, or false if null or undefined
 */
export function ensureBoolean(value: boolean | null | undefined): boolean {
  return value ?? false;
}

/**
 * Ensure a value is an array, even if null or undefined
 * @param value The value to convert
 * @returns The array value, or empty array if null or undefined
 */
export function ensureArray<T>(value: T[] | null | undefined): T[] {
  return value ?? [];
}

/**
 * Create a type-safe wrapper for functions that might be undefined
 * @param fn The function to wrap
 * @param defaultReturn The default return value if the function is undefined
 * @returns A function that safely calls the wrapped function
 */
export function safeFunction<T extends (...args: any[]) => any>(
  fn: T | undefined,
  defaultReturn: ReturnType<T>
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (fn) {
      return fn(...args);
    }
    return defaultReturn;
  }) as T;
}
