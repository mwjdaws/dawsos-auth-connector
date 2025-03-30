
/**
 * Type compatibility helpers for handling null vs. undefined
 */

/**
 * Converts undefined to null
 * Useful for APIs that expect null values rather than undefined
 */
export function undefinedToNull<T>(value: T | undefined): T | null;

/**
 * Converts null to undefined
 * Useful for APIs that expect undefined values rather than null
 */
export function nullToUndefined<T>(value: T | null): T | undefined;

/**
 * Ensures a value is a string, with empty string fallback
 */
export function ensureString(value: string | null | undefined): string;

/**
 * Safely invoke a callback with fallback if it's undefined
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined | null,
  defaultValue?: ReturnType<T>
): T;
