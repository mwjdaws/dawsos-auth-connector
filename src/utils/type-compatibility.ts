
/**
 * Type Compatibility Utilities
 * 
 * These utilities help ensure compatibility between different versions of types
 * and handle nullable/undefined values consistently.
 */

/**
 * Ensures a value is a string, converting null/undefined to empty string
 */
export function ensureString(value: string | null | undefined): string {
  return value ?? '';
}

/**
 * Ensures a value is a number, converting null/undefined to a default value
 */
export function ensureNumber(value: number | null | undefined, defaultValue = 0): number {
  return value ?? defaultValue;
}

/**
 * Ensures a value is a boolean, converting null/undefined to a default value
 */
export function ensureBoolean(value: boolean | null | undefined, defaultValue = false): boolean {
  return value ?? defaultValue;
}

/**
 * Converts undefined to null for nullable fields
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Converts null to undefined for optional fields
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensures an object is not null or undefined
 */
export function ensureObject<T>(obj: T | null | undefined, defaultValue: T): T {
  return obj ?? defaultValue;
}

/**
 * Ensures an array is not null or undefined
 */
export function ensureArray<T>(arr: T[] | null | undefined): T[] {
  return arr ?? [];
}
