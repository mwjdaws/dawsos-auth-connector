
/**
 * Error handling wrapper functions
 * 
 * Utility functions that wrap operations with error handling.
 */
import { handleError, handleErrorSafe } from './handle';
import { ErrorOptions } from './types';

/**
 * Try to execute a function and handle any errors
 * 
 * @param fn Function to execute
 * @param friendlyMessage Friendly error message to show
 * @param options Error handling options
 * @returns Result of the function or undefined if it fails
 */
export function tryExecute<T>(
  fn: () => T,
  friendlyMessage?: string,
  options?: ErrorOptions
): T | undefined {
  try {
    return fn();
  } catch (error) {
    handleError(error, friendlyMessage, options);
    return undefined;
  }
}

/**
 * Try to execute an async function and handle any errors
 * 
 * @param fn Async function to execute
 * @param friendlyMessage Friendly error message to show
 * @param options Error handling options
 * @returns Promise that resolves to the result of the function or undefined if it fails
 */
export async function tryExecuteAsync<T>(
  fn: () => Promise<T>,
  friendlyMessage?: string,
  options?: ErrorOptions
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, friendlyMessage, options);
    return undefined;
  }
}

/**
 * Safe version of tryExecute that won't throw even if error handling fails
 */
export function trySafeExecute<T>(
  fn: () => T,
  friendlyMessage?: string,
  options?: ErrorOptions
): T | undefined {
  try {
    return fn();
  } catch (error) {
    try {
      handleErrorSafe(error, friendlyMessage, options);
    } catch {
      // Last resort logging
      console.error('Failed to handle error:', error);
    }
    return undefined;
  }
}
