
/**
 * Error handling wrappers
 * 
 * Provides consistent error handling patterns for different contexts
 */
import { handleError, handleErrorSafe } from './handle';
import { ErrorHandlingOptions } from './types';

/**
 * Try to execute an action and handle any errors that occur
 * 
 * @param action The function to execute
 * @param errorMessage User-friendly error message
 * @param options Error handling options
 * @returns Promise that resolves to the result of the action or undefined if an error occurs
 */
export async function tryAction<T>(
  action: () => Promise<T>,
  errorMessage: string,
  options?: Partial<ErrorHandlingOptions>
): Promise<T | undefined> {
  try {
    return await action();
  } catch (error) {
    handleError(error, errorMessage, options);
    return undefined;
  }
}

/**
 * Create an error handler for a specific component
 * 
 * @param componentName Name of the component for error context
 * @param defaultOptions Default options for all errors
 * @returns Error handler function bound to the component
 */
export function createComponentErrorHandler(
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
        component: componentName
      }
    });
  };
}

/**
 * A higher-order function that wraps an async function with error handling
 * 
 * @param fn The function to wrap
 * @param errorMessage The error message to display
 * @param options Error handling options
 * @returns A wrapped function that handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage: string,
  options?: Partial<ErrorHandlingOptions>
): (...args: Parameters<T>) => Promise<ReturnType<T> | undefined> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorMessage, options);
      return undefined;
    }
  };
}
