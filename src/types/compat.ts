
/**
 * Type compatibility utilities
 */

/**
 * Converts undefined to null for use with APIs that
 * expect null instead of undefined
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Converts null to undefined for use with APIs that
 * expect undefined instead of null
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Makes properties optional and allows undefined values
 */
export type OptionalProps<T> = {
  [P in keyof T]?: T[P] | undefined;
};

/**
 * Makes specified properties of T required
 */
export type RequiredProps<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

/**
 * Makes properties accept null instead of undefined
 */
export type NullableProps<T> = {
  [P in keyof T]: T[P] | null;
};

/**
 * Creates a new object with nulls instead of undefined values
 */
export function withNulls<T extends object>(obj: T): NullableProps<T> {
  if (!obj) return {} as NullableProps<T>;
  
  const result: Record<string, any> = {};
  for (const key in obj) {
    result[key] = obj[key] === undefined ? null : obj[key];
  }
  return result as NullableProps<T>;
}

/**
 * Creates a new object with undefined instead of null values
 */
export function withUndefined<T extends object>(obj: T): OptionalProps<T> {
  if (!obj) return {} as OptionalProps<T>;
  
  const result: Record<string, any> = {};
  for (const key in obj) {
    result[key] = obj[key] === null ? undefined : obj[key];
  }
  return result as OptionalProps<T>;
}

/**
 * Safely access an object property that might be undefined
 */
export function safe<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj ? obj[key] : undefined;
}

/**
 * Safely call a function that might be undefined
 */
export function safeCall<T extends (...args: any[]) => any>(
  fn: T | null | undefined,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  return fn ? fn(...args) : undefined;
}
