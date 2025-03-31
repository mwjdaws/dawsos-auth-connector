
/**
 * Error handling wrapper functions
 * 
 * Provides higher-order functions for wrapping code with error handling
 */
import { handleError } from './handle';
import { ErrorLevel } from './types';

/**
 * Wraps a function with error handling
 * 
 * @param fn Function to wrap
 * @param options Error handling options
 * @returns Wrapped function that handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    errorMessage?: string;
    level?: ErrorLevel;
    silent?: boolean;
    technical?: boolean;
    deduplicate?: boolean;
    context?: Record<string, any>;
  } = {}
) {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(
        error,
        options.errorMessage || 'An operation failed',
        {
          level: options.level || 'warning',
          context: { ...options.context, args },
          silent: options.silent ?? false,
          technical: options.technical ?? true,
          deduplicate: options.deduplicate ?? true
        }
      );
      throw error; // Re-throw so calling code can handle it if needed
    }
  };
}

/**
 * Wraps a function with error handling and returns a fallback value on error
 * 
 * @param fn Function to wrap
 * @param fallbackValue Value to return on error
 * @param options Error handling options
 * @returns Wrapped function that handles errors and returns fallback value
 */
export function withErrorFallback<T extends (...args: any[]) => any>(
  fn: T,
  fallbackValue: ReturnType<T>,
  options: {
    errorMessage?: string;
    level?: ErrorLevel;
    silent?: boolean;
    technical?: boolean;
    deduplicate?: boolean;
    context?: Record<string, any>;
  } = {}
) {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(
        error,
        options.errorMessage || 'An operation failed',
        {
          level: options.level || 'warning',
          context: { ...options.context, args },
          silent: options.silent ?? false,
          technical: options.technical ?? true,
          deduplicate: options.deduplicate ?? true
        }
      );
      return fallbackValue;
    }
  };
}
