
/**
 * Utility functions to ensure backward compatibility
 */

/**
 * Create a safe callback function that won't error if the 
 * original function is undefined or null
 * 
 * @param fn - The original function
 * @param defaultFn - Default function to use if original is not valid
 * @returns A safe function that won't throw if called
 */
export function safeCallback<T extends any[], R>(
  fn: ((...args: T) => R) | undefined | null,
  defaultFn: (...args: T) => R
): (...args: T) => R {
  return (...args: T) => {
    if (typeof fn === 'function') {
      return fn(...args);
    }
    return defaultFn(...args);
  };
}

/**
 * Ensures a value is a string, providing a default if it's undefined or null
 * 
 * @param value - The value to check
 * @param defaultValue - Default value to use if original is not valid
 * @returns A valid string
 */
export function ensureString(value: any, defaultValue: string = ''): string {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  return String(value);
}

/**
 * Ensures a value is a number, providing a default if it's not a valid number
 * 
 * @param value - The value to check
 * @param defaultValue - Default value to use if original is not valid
 * @returns A valid number
 */
export function ensureNumber(value: any, defaultValue: number = 0): number {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return defaultValue;
  }
  
  return Number(value);
}

/**
 * Ensures a value is a boolean, providing a default if it's not a valid boolean
 * 
 * @param value - The value to check
 * @param defaultValue - Default value to use if original is not valid
 * @returns A valid boolean
 */
export function ensureBoolean(value: any, defaultValue: boolean = false): boolean {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  return Boolean(value);
}

/**
 * Ensures a value is an array, providing a default if it's not a valid array
 * 
 * @param value - The value to check
 * @param defaultValue - Default value to use if original is not valid
 * @returns A valid array
 */
export function ensureArray<T>(value: any, defaultValue: T[] = []): T[] {
  if (!Array.isArray(value)) {
    return defaultValue;
  }
  
  return value;
}

/**
 * Ensures a value is an object, providing a default if it's not a valid object
 * 
 * @param value - The value to check
 * @param defaultValue - Default value to use if original is not valid
 * @returns A valid object
 */
export function ensureObject<T extends object>(value: any, defaultValue: T): T {
  if (value === undefined || value === null || typeof value !== 'object' || Array.isArray(value)) {
    return defaultValue;
  }
  
  return value as T;
}
