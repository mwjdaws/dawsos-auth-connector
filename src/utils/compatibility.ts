
/**
 * Safe callback function
 * 
 * Safely invokes a callback function if it exists, with proper TypeScript typing.
 * Useful for handling optional callbacks in a type-safe way.
 * 
 * @param callback The callback function to invoke
 * @param args Arguments to pass to the callback
 * @returns The result of the callback, or undefined if the callback doesn't exist
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined | null,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return undefined;
}

/**
 * Check if a value is defined (not null or undefined)
 * 
 * @param value The value to check
 * @returns True if the value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Safely access a property from an object, with a default value
 * 
 * @param obj The object to access
 * @param key The property key to access
 * @param defaultValue The default value to return if the property doesn't exist
 * @returns The property value or the default value
 */
export function safeGet<T, K extends keyof T>(
  obj: T | null | undefined,
  key: K,
  defaultValue: T[K]
): T[K] {
  if (!obj) return defaultValue;
  return obj[key] !== undefined ? obj[key] : defaultValue;
}

/**
 * Legacy adapter for tag operations
 * 
 * Converts new tag operation signatures to match legacy code
 * 
 * @param newFn The new function to adapt
 * @param mapper Optional mapping function for arguments
 * @returns A function with the legacy signature
 */
export function adaptLegacyTagOperation<T extends (...args: any[]) => Promise<any>>(
  newFn: T,
  mapper?: (...args: any[]) => Parameters<T>
): (...args: any[]) => Promise<any> {
  return async (...args: any[]) => {
    try {
      if (mapper) {
        return await newFn(...mapper(...args));
      }
      return await newFn(...args);
    } catch (error) {
      console.error('Error in legacy tag operation:', error);
      return null;
    }
  };
}
