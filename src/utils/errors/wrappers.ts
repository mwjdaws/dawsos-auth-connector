
/**
 * Error handling wrapper functions
 * 
 * This module provides higher-order functions and wrappers to simplify
 * error handling across the application.
 */
import { handleError } from './handle';
import { ErrorHandlingOptions, ErrorLevel } from './types';

/**
 * Creates an error handler function for a specific component
 * 
 * @param componentName The name of the component for context
 * @returns A function to handle errors with the component context included
 */
export function createComponentErrorHandler(componentName: string) {
  return (
    error: unknown, 
    userMessage?: string, 
    options?: Partial<ErrorHandlingOptions>
  ) => {
    handleError(error, userMessage, {
      ...options,
      context: {
        ...options?.context,
        component: componentName,
        source: 'component'
      },
      level: options?.level || ErrorLevel.ERROR
    });
  };
}

/**
 * Creates an error handler function for a specific hook
 * 
 * @param hookName The name of the hook for context
 * @returns A function to handle errors with the hook context included
 */
export function createHookErrorHandler(hookName: string) {
  return (
    error: unknown, 
    userMessage?: string, 
    options?: Partial<ErrorHandlingOptions>
  ) => {
    handleError(error, userMessage, {
      ...options,
      context: {
        ...options?.context,
        hook: hookName,
        source: 'hook'
      },
      level: options?.level || ErrorLevel.ERROR
    });
  };
}

/**
 * Creates an error handler function for a specific service
 * 
 * @param serviceName The name of the service for context
 * @returns A function to handle errors with the service context included
 */
export function createServiceErrorHandler(serviceName: string) {
  return (
    error: unknown, 
    userMessage?: string, 
    options?: Partial<ErrorHandlingOptions>
  ) => {
    handleError(error, userMessage, {
      ...options,
      context: {
        ...options?.context,
        service: serviceName,
        source: 'service'
      },
      level: options?.level || ErrorLevel.ERROR
    });
  };
}

/**
 * Wraps a function with error handling
 * 
 * @param fn The function to wrap
 * @param errorHandler The error handler to use
 * @param userMessage An optional user-friendly message for errors
 * @param options Additional error handling options
 * @returns The wrapped function
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  errorHandler: (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => void,
  userMessage?: string,
  options?: Partial<ErrorHandlingOptions>
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    try {
      return fn(...args);
    } catch (error) {
      errorHandler(error, userMessage, options);
      return undefined;
    }
  };
}

/**
 * Safely executes an async action with error handling
 * 
 * @param action The async action to execute
 * @param errorHandler The error handler to use
 * @param userMessage An optional user-friendly message for errors
 * @param options Additional error handling options
 * @returns A promise that resolves to the action result or undefined on error
 */
export async function tryAction<T>(
  action: () => Promise<T>,
  errorHandler: (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => void,
  userMessage?: string,
  options?: Partial<ErrorHandlingOptions>
): Promise<T | undefined> {
  try {
    return await action();
  } catch (error) {
    errorHandler(error, userMessage, options);
    return undefined;
  }
}
