
import { toast } from "@/hooks/use-toast";
import { ErrorLevel, ErrorSource, ErrorHandlingOptions } from './types';
import { convertErrorOptions } from './compatibility';
import { generateErrorId } from './generateId';

// Default error handling options
const DEFAULT_ERROR_OPTIONS: ErrorHandlingOptions = {
  message: "An unexpected error occurred",
  level: ErrorLevel.Error,
  source: ErrorSource.Unknown,
  toastTitle: "Error",
  toastDescription: "An unexpected error occurred",
  suppressToast: false,
  context: {}
};

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
export function handleError(
  error: unknown,
  message?: string | Partial<ErrorHandlingOptions>,
  options?: Partial<ErrorHandlingOptions>
) {
  // Parse options based on different argument patterns
  let errorOptions: ErrorHandlingOptions;
  
  if (typeof message === 'string' && options) {
    // Handle case: handleError(error, "message", { level: ErrorLevel.Error })
    errorOptions = {
      ...DEFAULT_ERROR_OPTIONS,
      ...convertErrorOptions(options),
      message,
      toastTitle: message
    };
  } else if (typeof message === 'object') {
    // Handle case: handleError(error, { message: "message", level: ErrorLevel.Error })
    errorOptions = {
      ...DEFAULT_ERROR_OPTIONS,
      ...convertErrorOptions(message)
    };
  } else if (typeof message === 'string') {
    // Handle case: handleError(error, "message")
    errorOptions = {
      ...DEFAULT_ERROR_OPTIONS,
      message,
      toastTitle: message
    };
  } else {
    // Handle case: handleError(error)
    errorOptions = { ...DEFAULT_ERROR_OPTIONS };
  }

  // Generate a unique ID for this error
  const errorId = generateErrorId();

  // Extract information from the error
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Log the error with context
  console.error(
    `[${errorOptions.source}] ${errorOptions.message}`,
    {
      errorId,
      originalError: error,
      level: errorOptions.level,
      context: errorOptions.context,
      stack: errorStack
    }
  );

  // Show toast notification unless suppressed
  if (!errorOptions.suppressToast) {
    toast({
      id: errorId,
      title: errorOptions.toastTitle || errorOptions.message,
      description: errorOptions.toastDescription || errorMessage,
      variant: "destructive"
    });
  }

  // Return enhanced error information for further processing if needed
  return {
    id: errorId,
    message: errorOptions.message,
    originalError: error,
    level: errorOptions.level,
    source: errorOptions.source,
    context: errorOptions.context
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
      source: ErrorSource.Unknown,
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
      source: ErrorSource.Server,
      context: { service: serviceName },
      ...options
    });
  };
}
