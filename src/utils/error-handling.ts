import { toast, errorToast, deduplicateToast } from "@/hooks/use-toast";
import { ErrorHandlingOptions, ErrorLevel, ErrorSource, defaultErrorOptions } from "./errors/types";

/**
 * Centralized error handler for the application
 * 
 * @param error The error to handle
 * @param options Options for how to handle the error
 */
export const handleError = (error: Error | unknown, options?: Partial<ErrorHandlingOptions>) => {
  const mergedOptions: ErrorHandlingOptions = {
    ...defaultErrorOptions,
    ...options
  };

  // Convert unknown errors to Error objects
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  
  // Log error to console based on level
  logError(normalizedError, mergedOptions);
  
  // Report to analytics service if enabled
  if (mergedOptions.reportToAnalytics) {
    reportToAnalytics(normalizedError, mergedOptions);
  }
  
  // Show toast notification if enabled
  if (mergedOptions.showToast) {
    showErrorToast(normalizedError, mergedOptions);
  }
  
  return normalizedError;
};

/**
 * Log error to console with appropriate severity
 */
const logError = (error: Error, options: ErrorHandlingOptions) => {
  const { level, context, technical } = options;
  const message = `[${level.toUpperCase()}] ${error.message}`;
  const details = { context, technical, stack: error.stack };
  
  switch (level) {
    case ErrorLevel.DEBUG:
      console.debug(message, details);
      break;
    case ErrorLevel.INFO:
      console.info(message, details);
      break;
    case ErrorLevel.WARNING:
      console.warn(message, details);
      break;
    case ErrorLevel.ERROR:
    default:
      console.error(message, details);
  }
};

/**
 * Report error to analytics service
 */
const reportToAnalytics = (error: Error, options: ErrorHandlingOptions) => {
  // This would integrate with your analytics service
  // For now, we'll just note that we would report this
  console.log(`[Analytics] Would report error: ${error.message}`, {
    level: options.level,
    source: options.source,
    fingerprint: options.fingerprint,
    context: options.context
  });
};

/**
 * Show toast notification for error
 */
const showErrorToast = (error: Error, options: ErrorHandlingOptions) => {
  const title = options.toastTitle || 'An error occurred';
  const description = options.message || error.message;
  
  if (options.toastId) {
    // Use deduplication if an ID is provided
    deduplicateToast(options.toastId, {
      title,
      description, 
      variant: 'destructive'
    });
  } else {
    // Otherwise just show a normal error toast
    errorToast(title, description);
  }
};

/**
 * Create a component-specific error handler
 */
export const createErrorHandler = (defaultOptions?: Partial<ErrorHandlingOptions>) => {
  return (error: Error | unknown, options?: Partial<ErrorHandlingOptions>) => {
    return handleError(error, {
      ...defaultOptions,
      ...options
    });
  };
};

/**
 * Helper function to check if an error is of a specific type
 */
export const isErrorType = (error: unknown, errorType: any): boolean => {
  return error instanceof errorType;
};

/**
 * Convert errors to user-friendly messages
 */
export const getUserFriendlyErrorMessage = (error: Error | unknown): string => {
  if (error instanceof Error) {
    // Check for specific error types and customize messages
    if (error.message.includes('network')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    if (error.message.includes('timeout')) {
      return 'The request timed out. Please try again later.';
    }
    
    if (error.message.includes('permission')) {
      return 'You do not have permission to perform this action.';
    }
    
    // Default case for other Error instances
    return error.message;
  }
  
  // For non-Error objects
  return 'An unexpected error occurred';
};

/**
 * Create a component-specific error handler
 */
export const createComponentErrorHandler = (componentName: string, defaultOptions?: Partial<ErrorHandlingOptions>) => {
  return (error: Error | unknown, options?: Partial<ErrorHandlingOptions>) => {
    return handleError(error, {
      context: { component: componentName },
      ...defaultOptions,
      ...options
    });
  };
};

/**
 * Create a hook-specific error handler
 */
export const createHookErrorHandler = (hookName: string, defaultOptions?: Partial<ErrorHandlingOptions>) => {
  return (error: Error | unknown, options?: Partial<ErrorHandlingOptions>) => {
    return handleError(error, {
      context: { hook: hookName },
      ...defaultOptions,
      ...options
    });
  };
};

/**
 * Create a service-specific error handler
 */
export const createServiceErrorHandler = (serviceName: string, defaultOptions?: Partial<ErrorHandlingOptions>) => {
  return (error: Error | unknown, options?: Partial<ErrorHandlingOptions>) => {
    return handleError(error, {
      context: { service: serviceName },
      ...defaultOptions,
      ...options
    });
  };
};
