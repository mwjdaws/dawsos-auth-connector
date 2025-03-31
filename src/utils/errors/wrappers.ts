
/**
 * Error handling utility wrappers
 * 
 * Provides higher-order functions to handle errors consistently throughout the application
 */
import { handleError } from './handle';
import { WithErrorHandlingOptions } from './types';

/**
 * Wraps a function to handle any errors it throws
 * 
 * @param fn The function to wrap
 * @param options Options for error handling
 * @returns A wrapped function that handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  options: WithErrorHandlingOptions = {}
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      const result = fn(...args);
      
      // Handle promises
      if (result instanceof Promise) {
        return result.catch((error) => {
          // Extract context from options
          const context = options.context || {};
          
          // Determine if we should be silent
          const silent = options.silent || false;
          
          // Custom error message or use default
          const errorMessage = options.errorMessage || 'An error occurred';
          
          // Handle the error
          handleError(error, errorMessage, {
            context,
            silent,
            level: options.level || 'error'
          });
          
          // Call onError if provided
          if (options.onError) {
            options.onError(error);
          }
          
          // Return default value or re-throw
          if ('defaultValue' in options) {
            return options.defaultValue as ReturnType<T>;
          }
          
          throw error;
        }) as ReturnType<T>;
      }
      
      return result;
    } catch (error) {
      // Extract context from options
      const context = options.context || {};
      
      // Determine if we should be silent
      const silent = options.silent || false;
      
      // Custom error message or use default
      const errorMessage = options.errorMessage || 'An error occurred';
      
      // Handle the error
      handleError(error, errorMessage, {
        context,
        silent,
        level: options.level || 'error'
      });
      
      // Call onError if provided
      if (options.onError) {
        options.onError(error);
      }
      
      // Return default value or re-throw
      if ('defaultValue' in options) {
        return options.defaultValue as ReturnType<T>;
      }
      
      throw error;
    }
  };
}

/**
 * Type for a function that can be wrapped
 */
export type WrappableFunction<T> = (...args: any[]) => Promise<T>;

/**
 * Wraps an asynchronous function to provide consistent error handling
 */
export function withAsyncErrorHandling<T>(
  fn: WrappableFunction<T>,
  options: WithErrorHandlingOptions = {}
): WrappableFunction<T> {
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Handle the error
      handleError(error, options.errorMessage || 'An error occurred in async operation', {
        context: options.context || {},
        silent: options.silent || false,
        level: options.level || 'error'
      });
      
      // Call onError if provided
      if (options.onError) {
        options.onError(error);
      }
      
      // Return default value or re-throw
      if ('defaultValue' in options) {
        return options.defaultValue as T;
      }
      
      throw error;
    }
  };
}
