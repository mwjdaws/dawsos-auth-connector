
import { toast } from "@/hooks/use-toast";
import { ErrorLevel, ErrorSource, ErrorHandlingOptions, defaultErrorOptions } from './errors/types';
import { compatibleErrorOptions } from './errors/compatibility';

/**
 * Central error handling function
 * 
 * This function processes all errors in the application in a consistent way
 * by providing informative toasts, logging, and context preservation.
 * 
 * @param error The error object that was caught
 * @param message Custom error message (optional)
 * @param options Additional options for error handling
 */
export const handleError = (
  error: unknown,
  message?: string | Partial<ErrorHandlingOptions>,
  options?: Partial<ErrorHandlingOptions>
) => {
  // Parse options based on different argument patterns
  let errorOptions: ErrorHandlingOptions;
  
  if (typeof message === 'string' && options) {
    // Handle case: handleError(error, "message", { level: ErrorLevel.Error })
    errorOptions = {
      ...defaultErrorOptions,
      ...compatibleErrorOptions(options),
      message,
      toastTitle: message
    };
  } else if (typeof message === 'object') {
    // Handle case: handleError(error, { message: "message", level: ErrorLevel.Error })
    errorOptions = {
      ...defaultErrorOptions,
      ...compatibleErrorOptions(message)
    };
  } else if (typeof message === 'string') {
    // Handle case: handleError(error, "message")
    errorOptions = {
      ...defaultErrorOptions,
      message,
      toastTitle: message
    };
  } else {
    // Handle case: handleError(error)
    errorOptions = { ...defaultErrorOptions };
  }

  // Extract information from the error
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Log the error with context
  console.error(
    `[${errorOptions.source}] ${errorOptions.message || errorMessage}`,
    {
      originalError: error,
      level: errorOptions.level,
      context: errorOptions.context,
      stack: errorStack
    }
  );

  // Show toast notification unless suppressed
  if (!errorOptions.suppressToast && !errorOptions.silent && errorOptions.showToast) {
    toast({
      id: errorOptions.toastId,
      title: errorOptions.toastTitle || errorOptions.message || (errorOptions.level === ErrorLevel.Error ? 'Error' : errorOptions.level === ErrorLevel.Warning ? 'Warning' : 'Notice'),
      description: errorOptions.toastDescription || errorMessage,
      variant: errorOptions.level === ErrorLevel.Error ? 'destructive' : 'default',
    });
  }

  // Return enhanced error information for further processing if needed
  return {
    message: errorOptions.message,
    originalError: error,
    level: errorOptions.level,
    source: errorOptions.source,
    context: errorOptions.context
  };
};

/**
 * Creates an error handler function with predefined context
 * 
 * @param componentName The name of the component or module
 * @param defaultOptions Default options for all errors handled by this function
 * @returns An error handler function with predefined context
 */
export function createErrorHandler(
  componentName: string,
  defaultOptions?: Partial<ErrorHandlingOptions>
) {
  return (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>): void => {
    handleError(error, message, {
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

/**
 * Create an error handler for components
 */
export function createComponentErrorHandler(componentName: string) {
  return (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => {
    return handleError(error, message, {
      source: ErrorSource.UI,
      context: { component: componentName },
      ...options
    });
  };
}

/**
 * Create an error handler for hooks
 */
export function createHookErrorHandler(hookName: string) {
  return (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => {
    return handleError(error, message, {
      source: ErrorSource.System,
      context: { hook: hookName },
      ...options
    });
  };
}

/**
 * Create an error handler for services
 */
export function createServiceErrorHandler(serviceName: string) {
  return (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => {
    return handleError(error, message, {
      source: ErrorSource.API,
      context: { service: serviceName },
      ...options
    });
  };
}
