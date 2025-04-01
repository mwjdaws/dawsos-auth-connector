
/**
 * Compatibility utility functions
 * 
 * These utilities help with type conversions and compatibility between different
 * components and data structures in the application.
 */

/**
 * Ensures a value is a string
 * 
 * @param value Any value that should be treated as a string
 * @param defaultValue Optional default value if input is null/undefined
 */
export function ensureString(value: any, defaultValue: string = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value);
}

/**
 * Ensures a value is a number
 * 
 * @param value Any value that should be treated as a number
 * @param defaultValue Optional default value if input is null/undefined or NaN
 */
export function ensureNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Ensures a value is a boolean
 * 
 * @param value Any value that should be treated as a boolean
 * @param defaultValue Optional default value if input is null/undefined
 */
export function ensureBoolean(value: any, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return Boolean(value);
}

/**
 * Converts undefined to null for APIs that expect null
 * 
 * @param value Any value that might be undefined
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Converts null to undefined for APIs that expect undefined
 * 
 * @param value Any value that might be null
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Safely calls a callback function if it exists
 * 
 * @param callback Optional callback function
 * @param args Arguments to pass to the callback
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return undefined;
}

/**
 * Makes all properties in T accept undefined
 */
export type WithUndefined<T> = {
  [P in keyof T]?: T[P] | undefined;
}

/**
 * Makes all properties in T accept null
 */
export type WithNull<T> = {
  [P in keyof T]: T[P] | null;
}

/**
 * Makes all properties in T optional
 */
export type Optional<T> = {
  [P in keyof T]?: T[P];
}

/**
 * Creates a new object with null values instead of undefined
 */
export function objectWithNulls<T extends object>(obj: T): WithNull<T> {
  if (!obj) return {} as WithNull<T>;
  
  const result: Record<string, any> = {};
  for (const key in obj) {
    result[key] = obj[key] === undefined ? null : obj[key];
  }
  return result as WithNull<T>;
}

/**
 * Creates a new object with undefined values instead of null
 */
export function objectWithUndefined<T extends object>(obj: T): WithUndefined<T> {
  if (!obj) return {} as WithUndefined<T>;
  
  const result: Record<string, any> = {};
  for (const key in obj) {
    result[key] = obj[key] === null ? undefined : obj[key];
  }
  return result as WithUndefined<T>;
}
