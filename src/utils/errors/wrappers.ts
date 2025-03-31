
import { handleError } from './handle';

interface ErrorOptions {
  context?: Record<string, any>;
  level?: 'debug' | 'info' | 'warning' | 'error';
  silent?: boolean;
  errorMessage?: string;
}

/**
 * Try an action and handle any errors
 * 
 * @param action The action to try
 * @param options Options for error handling or a simple error message string
 * @returns The result of the action
 */
export async function tryAction<T>(
  action: () => Promise<T>,
  options?: ErrorOptions | string
): Promise<T> {
  try {
    return await action();
  } catch (err) {
    // Handle different overload formats
    const opts: ErrorOptions = typeof options === 'string' 
      ? { errorMessage: options } 
      : options || {};
    
    handleError(err, opts.errorMessage || 'Operation failed', {
      level: opts.level || 'error',
      context: opts.context,
      silent: opts.silent
    });
    
    throw err;
  }
}

/**
 * Create an error handler for a specific component
 * 
 * @param componentName The name of the component
 * @returns An error handler function for that component
 */
export function createComponentErrorHandler(componentName: string) {
  return (error: unknown, message?: string, options?: ErrorOptions) => {
    handleError(error, message, {
      ...options,
      context: {
        ...(options?.context || {}),
        component: componentName
      }
    });
  };
}

/**
 * Wrap a function with error handling
 * 
 * @param fn The function to wrap
 * @param options Error handling options
 * @returns A wrapped function that handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: { errorMessage?: string; context?: Record<string, any> }
) {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (err) {
      handleError(
        err,
        options?.errorMessage || `Error in ${fn.name || 'anonymous function'}`,
        { context: options?.context }
      );
      throw err;
    }
  };
}

/**
 * Create a version of tryAction specific to a component
 * 
 * @param componentName The name of the component
 * @returns A tryAction function with the component name in the context
 */
export function createComponentTryAction(componentName: string) {
  return async <T>(
    action: () => Promise<T>,
    errorMessage: string,
    options?: ErrorOptions
  ): Promise<T> => {
    try {
      return await action();
    } catch (err) {
      handleError(err, errorMessage, {
        ...options,
        context: {
          ...(options?.context || {}),
          component: componentName
        }
      });
      throw err;
    }
  };
}
