/**
 * Core error handling functionality
 */
import { toast } from '@/hooks/use-toast';
import { deduplicateError, hasErrorBeenSeen } from './deduplication';
import { formatErrorForDisplay, formatErrorForDebug } from './format';
import { generateErrorId } from './generateId';
import { ErrorLevel, ErrorSource, type ErrorHandlingOptions, type EnhancedError } from './types';
import { convertLegacyOptions } from './helper';

// Re-export ErrorLevel
export { ErrorLevel };

/**
 * Central error handler function
 * 
 * This function processes errors in a consistent way across the application:
 * - Logs errors with appropriate detail level
 * - Displays user-friendly messages via toast notifications
 * - Deduplicates repeated errors to avoid flooding
 * - Tracks errors with unique IDs
 * 
 * @param error The error to handle
 * @param message Optional user-friendly message
 * @param options Additional error handling options
 * @returns The processed error (for chaining)
 */
export function handleError(
  error: unknown,
  message?: string,
  options?: Partial<ErrorHandlingOptions>
): Error {
  // Convert legacy options format if needed
  const normalizedOptions = convertLegacyOptions(options);
  
  // Normalize the error to Error type
  const normalizedError = error instanceof Error 
    ? error 
    : new Error(typeof error === 'string' ? error : 'Unknown error');
  
  // Apply enhanced properties and deduplicate
  const enhancedError = enhanceError(normalizedError, normalizedOptions);
  
  // Check if this is a duplicate error we've seen before
  if (hasErrorBeenSeen(enhancedError, normalizedOptions)) {
    console.info('Skipping duplicate error:', enhancedError.message);
    return enhancedError;
  }
  
  // Mark the error as seen for future deduplication
  deduplicateError(enhancedError, normalizedOptions);
  
  // Determine error level for logging
  const level = normalizedOptions?.level || ErrorLevel.ERROR;
  
  // Format the message for display (if one was provided)
  const displayMessage = formatErrorForDisplay(
    enhancedError, 
    message,
    normalizedOptions
  );
  
  // Format a detailed debug message
  const debugMessage = formatErrorForDebug(enhancedError, normalizedOptions);
  
  // Log the error with appropriate level
  switch (level) {
    case ErrorLevel.DEBUG:
      console.debug(debugMessage);
      break;
    case ErrorLevel.INFO:
      console.info(debugMessage);
      break;
    case ErrorLevel.WARNING:
      console.warn(debugMessage);
      break;
    case ErrorLevel.ERROR:
    default:
      console.error(debugMessage);
      break;
  }
  
  // Show toast notification if requested (default for errors)
  if (normalizedOptions?.showToast !== false && level === ErrorLevel.ERROR) {
    toast({
      title: 'Error',
      description: displayMessage,
      variant: 'destructive',
      id: normalizedOptions?.toastId
    });
  }
  
  return enhancedError;
}

/**
 * Enhance an error with additional context and metadata
 */
function enhanceError(
  error: Error,
  options?: Partial<ErrorHandlingOptions>
): EnhancedError {
  const enhancedError = error as EnhancedError;
  
  // Add context from options
  if (options) {
    enhancedError.level = options.level;
    enhancedError.source = options.source;
    enhancedError.fingerprint = options.fingerprint;
    enhancedError.context = options.context;
  }
  
  return enhancedError;
}

/**
 * Safe error handler that won't throw additional errors
 */
export function handleErrorSafe(
  error: unknown,
  message?: string,
  options?: Partial<ErrorHandlingOptions>
): Error {
  try {
    return handleError(error, message, options);
  } catch (handlingError) {
    // Last resort error handling
    console.error('Error in error handler:', handlingError);
    console.error('Original error:', error);
    
    // Return a generic error if everything fails
    return new Error(
      typeof message === 'string'
        ? message
        : 'An error occurred and could not be processed'
    );
  }
}

/**
 * Creates an error handler with pre-configured options for a specific context
 */
export function createErrorHandler(
  defaultOptions: Partial<ErrorHandlingOptions>
): (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => Error {
  return (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => {
    return handleError(error, message, {
      ...defaultOptions,
      ...options,
      context: {
        ...(defaultOptions.context || {}),
        ...(options?.context || {})
      }
    });
  };
}

/**
 * Creates an error handler for a specific component
 */
export function createComponentErrorHandler(
  componentName: string
): (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => Error {
  return createErrorHandler({
    source: `${ErrorSource.COMPONENT}:${componentName}`
  });
}

/**
 * Creates an error handler for a specific hook
 */
export function createHookErrorHandler(
  hookName: string
): (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => Error {
  return createErrorHandler({
    source: `${ErrorSource.HOOK}:${hookName}`
  });
}

/**
 * Creates an error handler for a specific service
 */
export function createServiceErrorHandler(
  serviceName: string
): (error: unknown, message?: string, options?: Partial<ErrorHandlingOptions>) => Error {
  return createErrorHandler({
    source: `${ErrorSource.SERVICE}:${serviceName}`
  });
}
