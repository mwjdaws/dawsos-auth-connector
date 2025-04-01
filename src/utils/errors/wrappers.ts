
/**
 * Error handling wrapper functions
 */
import { ErrorLevel, ErrorSource, type ErrorHandlingOptions } from './types';
import { handleError, handleErrorSafe } from './handle';

/**
 * Wraps a function with error handling
 * 
 * @param fn The function to wrap
 * @param options Error handling options
 * @returns A wrapped function that handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  options?: Partial<ErrorHandlingOptions> & { errorMessage?: string }
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      return fn(...args);
    } catch (error) {
      const message = options?.errorMessage || 'An error occurred';
      const errorHandlingOptions: Partial<ErrorHandlingOptions> = {
        ...options,
        context: {
          ...(options?.context || {}),
          functionName: fn.name,
          arguments: args
        }
      };
      
      // Remove errorMessage from options as it's not part of ErrorHandlingOptions
      if ('errorMessage' in errorHandlingOptions) {
        delete errorHandlingOptions.errorMessage;
      }
      
      handleError(error, message, errorHandlingOptions);
      throw error; // Re-throw to allow caller to handle
    }
  };
}

/**
 * Creates a component-specific error handler
 */
export function createComponentErrorHandler(
  componentName: string
): (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => Error {
  return (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => {
    return handleError(error, message, {
      source: `${ErrorSource.COMPONENT}:${componentName}`,
      level: ErrorLevel.ERROR,
      ...options
    });
  };
}

/**
 * Creates a hook-specific error handler
 */
export function createHookErrorHandler(
  hookName: string
): (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => Error {
  return (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => {
    return handleError(error, message, {
      source: `${ErrorSource.HOOK}:${hookName}`,
      level: ErrorLevel.ERROR,
      ...options
    });
  };
}

/**
 * Creates a service-specific error handler
 */
export function createServiceErrorHandler(
  serviceName: string
): (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => Error {
  return (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => {
    return handleError(error, message, {
      source: `${ErrorSource.SERVICE}:${serviceName}`,
      level: ErrorLevel.ERROR,
      ...options
    });
  };
}

/**
 * Try-catch wrapper for actions (used in components)
 * 
 * @param action Function to try
 * @param errorHandler Error handler function
 * @returns Result of the action, or undefined if it fails
 */
export function tryAction<T>(
  action: () => T,
  errorHandler?: (error: unknown) => void
): T | undefined {
  try {
    return action();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      handleErrorSafe(error, 'Action failed');
    }
    return undefined;
  }
}
