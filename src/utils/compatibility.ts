
/**
 * Utility functions for ensuring compatibility with different types
 * and handling null/undefined values safely.
 */

/**
 * Ensures a value is a string or empty string if undefined/null
 */
export function ensureString(value?: string | null): string {
  return value !== undefined && value !== null ? value : '';
}

/**
 * Ensures a value is a number or returns a default value
 */
export function ensureNumber(value?: number | null, defaultValue: number = 0): number {
  return (value !== undefined && value !== null) ? value : defaultValue;
}

/**
 * Ensures a value is a boolean or returns a default value
 */
export function ensureBoolean(value?: boolean | null, defaultValue: boolean = false): boolean {
  return (value !== undefined && value !== null) ? value : defaultValue;
}

/**
 * Ensures an object is not null or undefined, returning an empty object if it is
 */
export function ensureObject<T extends object>(obj?: T | null, defaultValue: T = {} as T): T {
  return (obj !== undefined && obj !== null) ? obj : defaultValue;
}

/**
 * Ensures an array is not null or undefined, returning an empty array if it is
 */
export function ensureArray<T>(arr?: T[] | null): T[] {
  return (arr !== undefined && arr !== null) ? arr : [];
}

/**
 * Safely get a property from an object, handling null/undefined
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K, defaultValue: T[K]): T[K] {
  if (obj === null || obj === undefined) {
    return defaultValue;
  }
  return obj[key] !== undefined ? obj[key] : defaultValue;
}

/**
 * Converts null to undefined for optional parameters
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Converts undefined to null for API compatibility
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}
