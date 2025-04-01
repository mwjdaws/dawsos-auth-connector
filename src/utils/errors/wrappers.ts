
import { handleError } from './handle';
import { ErrorHandlingOptions, ErrorLevel } from './types';

/**
 * Creates an error handler that captures component errors
 * 
 * @param componentName The name of the component for context
 * @returns Error handler function with component context
 */
export function createComponentErrorHandler(componentName: string) {
  return (
    error: unknown, 
    userMessage?: string, 
    options?: Partial<ErrorHandlingOptions>
  ) => {
    const errorOptions: Partial<ErrorHandlingOptions> = {
      ...options,
      context: {
        ...options?.context,
        component: componentName,
        source: 'component'
      }
    };
    
    // If no level was specified, default to ERROR for component errors
    if (!errorOptions.level) {
      errorOptions.level = ErrorLevel.ERROR;
    }
    
    handleError(error, userMessage, errorOptions);
  };
}

/**
 * Creates an error handler that captures hook errors
 * 
 * @param hookName The name of the hook for context
 * @returns Error handler function with hook context
 */
export function createHookErrorHandler(hookName: string) {
  return (
    error: unknown, 
    userMessage?: string, 
    options?: Partial<ErrorHandlingOptions>
  ) => {
    const errorOptions: Partial<ErrorHandlingOptions> = {
      ...options,
      context: {
        ...options?.context,
        hook: hookName,
        source: 'hook'
      }
    };
    
    // If no level was specified, default to ERROR for hook errors
    if (!errorOptions.level) {
      errorOptions.level = ErrorLevel.ERROR;
    }
    
    handleError(error, userMessage, errorOptions);
  };
}

/**
 * Creates an error handler that captures service errors
 * 
 * @param serviceName The name of the service for context
 * @returns Error handler function with service context
 */
export function createServiceErrorHandler(serviceName: string) {
  return (
    error: unknown, 
    userMessage?: string, 
    options?: Partial<ErrorHandlingOptions>
  ) => {
    const errorOptions: Partial<ErrorHandlingOptions> = {
      ...options,
      context: {
        ...options?.context,
        service: serviceName,
        source: 'service'
      }
    };
    
    // If no level was specified, default to ERROR for service errors
    if (!errorOptions.level) {
      errorOptions.level = ErrorLevel.ERROR;
    }
    
    handleError(error, userMessage, errorOptions);
  };
}

/**
 * Higher-order function to wrap operations with error handling
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
 * Function to handle API and async operations safely
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
