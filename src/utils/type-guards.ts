
/**
 * Type guard utilities for safer type checking
 */

/**
 * Checks if value is not null or undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Checks if value is a string
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * Checks if value is a number
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Checks if value is a boolean
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Checks if value is an object (not null, not array)
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks if value is an array
 */
export function isArray<T>(value: any): value is Array<T> {
  return Array.isArray(value);
}

/**
 * Checks if value is a function
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * Checks if value has a specific property
 */
export function hasProperty<K extends string>(obj: any, prop: K): obj is { [key in K]: any } {
  return isObject(obj) && prop in obj;
}

/**
 * Ensures a value is of the expected type or provides a default
 */
export function ensureType<T>(value: any, defaultValue: T, validator: (val: any) => boolean): T {
  return validator(value) ? value : defaultValue;
}
