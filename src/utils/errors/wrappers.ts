
import { handleError } from './handle';
import { ErrorHandlingOptions } from './types';

/**
 * Type for functions that can be wrapped with error handling
 */
type WrappableFunction<T> = (...args: any[]) => Promise<T>;

/**
 * Options for withErrorHandling wrapper
 */
interface WithErrorHandlingOptions extends ErrorHandlingOptions {
  /**
   * Message to display when an error occurs
   */
  errorMessage?: string;
  
  /**
   * Default value to return on error
   */
  defaultValue?: any;
  
  /**
   * Additional context to include in error logs
   */
  contextFn?: (args: any[]) => Record<string, any>;
}

/**
 * Higher-order function that wraps an async function with standardized error handling
 * 
 * @param fn - The async function to wrap
 * @param options - Error handling options
 * @returns A wrapped function with error handling
 * 
 * @example
 * ```typescript
 * // Original function
 * const fetchData = async (id: string) => {
 *   const response = await fetch(`/api/data/${id}`);
 *   if (!response.ok) throw new Error('Failed to fetch data');
 *   return response.json();
 * };
 * 
 * // Wrapped function with error handling
 * const safeFetchData = withErrorHandling(fetchData, {
 *   errorMessage: 'Failed to load data',
 *   defaultValue: { empty: true },
 *   contextFn: (args) => ({ id: args[0] })
 * });
 * 
 * // Usage
 * const data = await safeFetchData('123');
 * ```
 */
export function withErrorHandling<T>(
  fn: WrappableFunction<T>,
  options: WithErrorHandlingOptions = {}
): WrappableFunction<T> {
  const {
    errorMessage = 'An error occurred',
    defaultValue = undefined,
    contextFn = () => ({}),
    ...errorOptions
  } = options;
  
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Get additional context from arguments if provided
      const context = contextFn ? contextFn(args) : {};
      
      // Handle the error
      handleError(error, errorMessage, {
        ...errorOptions,
        context: {
          ...context,
          ...errorOptions.context
        }
      });
      
      // Return default value or rethrow based on options
      if (errorOptions.silent) {
        return defaultValue as T;
      }
      throw error;
    }
  };
}

/**
 * Creates a version of the original function that executes in an error boundary
 * Any errors are handled but the function still rejects with the original error
 * 
 * @param fn - The async function to wrap
 * @param options - Error handling options
 * @returns A wrapped function that handles errors but still rejects
 */
export function logErrorsAndRethrow<T>(
  fn: WrappableFunction<T>,
  options: WithErrorHandlingOptions = {}
): WrappableFunction<T> {
  const {
    errorMessage = 'An error occurred',
    contextFn = () => ({}),
    ...errorOptions
  } = options;
  
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Get additional context from arguments if provided
      const context = contextFn ? contextFn(args) : {};
      
      // Handle the error (log it, don't show UI notification)
      handleError(error, errorMessage, {
        ...errorOptions,
        silent: true, // Don't show notifications
        context: {
          ...context,
          ...errorOptions.context
        }
      });
      
      // Always rethrow the original error
      throw error;
    }
  };
}
