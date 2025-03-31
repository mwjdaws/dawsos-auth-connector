
/**
 * Error handling wrapper functions
 * 
 * These functions wrap other functions with standardized error handling.
 */

import { handleError } from './handle';
import { ErrorOptions } from './types';

/**
 * Wrap an async function with standardized error handling
 * 
 * @param fn The async function to wrap
 * @param options Error handling options
 * @returns A new function that handles errors
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: { errorMessage?: string } & Partial<ErrorOptions>
): (...args: T) => Promise<R | undefined> {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(
        error,
        options.errorMessage,
        {
          level: options.level || 'error',
          context: { ...options.context, args },
          silent: options.silent,
          technical: options.technical,
          deduplicate: options.deduplicate
        }
      );
      return undefined;
    }
  };
}

/**
 * Wrap a synchronous function with standardized error handling
 * 
 * @param fn The function to wrap
 * @param options Error handling options
 * @returns A new function that handles errors
 */
export function withSyncErrorHandling<T extends any[], R>(
  fn: (...args: T) => R,
  options: { errorMessage?: string } & Partial<ErrorOptions>
): (...args: T) => R | undefined {
  return (...args: T): R | undefined => {
    try {
      return fn(...args);
    } catch (error) {
      handleError(
        error,
        options.errorMessage,
        {
          level: options.level || 'error',
          context: { ...options.context, args },
          silent: options.silent,
          technical: options.technical,
          deduplicate: options.deduplicate
        }
      );
      return undefined;
    }
  };
}

/**
 * Create a function that will retry a specified number of times if it fails
 * 
 * @param fn The function to retry
 * @param maxRetries Maximum number of retry attempts
 * @param delayMs Delay between retries in milliseconds
 * @returns A function that retries on failure
 */
export function withRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries: number = 3,
  delayMs: number = 1000
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        // Log the retry attempt
        if (attempt <= maxRetries) {
          console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`, error);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          
          // Exponential backoff
          delayMs = delayMs * 2;
        }
      }
    }
    
    // If we've exhausted all retries, throw the last error
    throw lastError;
  };
}
