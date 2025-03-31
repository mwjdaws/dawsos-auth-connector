
/**
 * Error handling wrappers
 * 
 * Provides utility functions to wrap code with standardized error handling.
 */
import { handleError, handleErrorSafe } from './handle';
import { ErrorHandlingOptions } from './types';

/**
 * Wrap an async function with standardized error handling
 * 
 * @param fn The async function to wrap
 * @param userMessage Optional user-friendly error message
 * @param options Additional error handling options
 * @returns A wrapped function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  userMessage?: string,
  options?: Partial<ErrorHandlingOptions>
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, userMessage, options);
      throw error; // Re-throw after handling
    }
  };
}

/**
 * Wrap an async function with error handling that doesn't re-throw
 * 
 * @param fn The async function to wrap
 * @param userMessage Optional user-friendly error message
 * @param options Additional error handling options
 * @returns A wrapped function with error handling that returns null on error
 */
export function withSafeErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  userMessage?: string,
  options?: Partial<ErrorHandlingOptions>
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | null> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleErrorSafe(error, userMessage, options);
      return null; // Return null instead of throwing
    }
  };
}

/**
 * Create a function that handles errors with predefined context
 * 
 * @param componentName The name of the component or module
 * @param defaultOptions Default options for all errors handled by this function
 * @returns An error handler function with predefined context
 */
export function createErrorHandler(
  componentName: string,
  defaultOptions?: Partial<ErrorHandlingOptions>
) {
  return (error: unknown, userMessage?: string, options?: Partial<ErrorHandlingOptions>) => {
    handleError(error, userMessage, {
      ...defaultOptions,
      ...options,
      context: {
        ...(defaultOptions?.context || {}),
        ...(options?.context || {}),
        componentName
      }
    });
  };
}
