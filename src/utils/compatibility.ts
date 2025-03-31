
/**
 * Compatibility utilities
 * 
 * Helper functions for maintaining backward compatibility
 * with older code while refactoring.
 */

/**
 * Safely calls a callback function if it exists
 * 
 * @param callback The callback to call
 * @param args Arguments to pass to the callback
 * @returns The result of the callback or undefined
 */
export function safeCallback<T, A extends any[]>(
  callback: ((...args: A) => T) | null | undefined,
  ...args: A
): T | undefined {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return undefined;
}

/**
 * Safely calls an async callback function if it exists
 * 
 * @param callback The async callback to call
 * @param args Arguments to pass to the callback
 * @returns Promise that resolves to the result of the callback or undefined
 */
export async function safeAsyncCallback<T, A extends any[]>(
  callback: ((...args: A) => Promise<T>) | null | undefined,
  ...args: A
): Promise<T | undefined> {
  if (typeof callback === 'function') {
    return await callback(...args);
  }
  return undefined;
}
