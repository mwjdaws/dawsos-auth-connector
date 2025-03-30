
import { handleError } from './handle';
import { ErrorHandlingOptions } from './types';

/**
 * Higher-order function that wraps a function with error handling
 * 
 * @param fn The function to wrap with error handling
 * @param userMessage User-friendly message to display on error
 * @param options Additional error handling options
 * @returns A wrapped function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  userMessage?: string,
  options?: ErrorHandlingOptions
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, userMessage, options);
      throw error; // Re-throw to allow caller to handle if needed
    }
  };
}

/**
 * Wraps an async operation in a try/catch block with error handling
 * 
 * @param promise The promise to wrap with error handling
 * @param userMessage User-friendly message to display on error
 * @param options Additional error handling options
 * @returns A promise that resolves to [data, null] or [null, error]
 */
export async function tryCatch<T>(
  promise: Promise<T>,
  userMessage?: string,
  options?: ErrorHandlingOptions
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const typedError = error instanceof Error ? error : new Error(String(error));
    handleError(typedError, userMessage, options);
    return [null, typedError];
  }
}
