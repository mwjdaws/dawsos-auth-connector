
/**
 * Error handling utilities
 */
import { toast } from '@/hooks/use-toast';
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './types';
import { formatErrorMessage } from './format';
import { isErrorDuplicate, storeErrorFingerprint, generateFingerprint } from './deduplication';
import { convertErrorOptions } from './compatibility';

// Default error handling options
const defaultErrorOptions: Partial<ErrorHandlingOptions> = {
  level: ErrorLevel.Error,
  source: ErrorSource.Unknown,
  reportToAnalytics: true,
  showToast: true,
  silent: false
};

/**
 * Main error handling function
 * 
 * @param error The error to handle
 * @param messageOrOptions A message string or options for error handling
 */
export function handleError(
  error: unknown,
  messageOrOptions?: string | Partial<ErrorHandlingOptions>
): void {
  try {
    // Process arguments to handle both forms
    let options: Partial<ErrorHandlingOptions>;
    
    if (typeof messageOrOptions === 'string') {
      options = { 
        ...defaultErrorOptions,
        message: messageOrOptions 
      };
    } else {
      options = { 
        ...defaultErrorOptions,
        ...convertErrorOptions(messageOrOptions)
      };
    }
    
    // Ensure we have a message
    if (!options.message) {
      options.message = formatErrorMessage(error);
    }
    
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    // Check for duplicate errors
    const fingerprint = options.fingerprint || generateFingerprint(error, options);
    if (fingerprint && isErrorDuplicate(fingerprint)) {
      // Skip duplicate error
      return;
    }
    
    // Store error fingerprint to avoid duplicates
    if (fingerprint) {
      storeErrorFingerprint(fingerprint);
    }
    
    // Always log to console with appropriate level
    if (!options.silent) {
      logErrorToConsole(errorObj, options);
    }
    
    // Show toast notification if enabled
    if (options.showToast && !options.suppressToast) {
      showErrorToast(options);
    }
    
    // Report to analytics if enabled
    if (options.reportToAnalytics) {
      reportErrorToAnalytics(errorObj, options);
    }
  } catch (handlerError) {
    // Fallback error handling if the error handler itself fails
    console.error('Error in error handler:', handlerError);
    console.error('Original error:', error);
    
    // Show a fallback toast
    toast({
      title: 'An error occurred',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive',
    });
  }
}

/**
 * Safe error handler that catches and handles any errors during error handling
 */
export function handleErrorSafe(
  error: unknown,
  messageOrOptions?: string | Partial<ErrorHandlingOptions>
): void {
  try {
    handleError(error, messageOrOptions);
  } catch (handlingError) {
    console.error('[CRITICAL] Error occurred during error handling:', handlingError);
    console.error('Original error:', error);
  }
}

/**
 * Log error to console with appropriate level
 */
function logErrorToConsole(
  error: Error,
  options: Partial<ErrorHandlingOptions>
): void {
  const { level, source, context, message } = options;
  
  const contextString = context 
    ? `\nContext: ${JSON.stringify(context)}`
    : '';
  
  const logMessage = `[${source || ErrorSource.Unknown}] ${message}${contextString}`;
  
  switch (level) {
    case ErrorLevel.Debug:
      console.debug(logMessage, error);
      break;
    case ErrorLevel.Info:
      console.info(logMessage, error);
      break;
    case ErrorLevel.Warning:
      console.warn(logMessage, error);
      break;
    case ErrorLevel.Critical:
      console.error(`CRITICAL: ${logMessage}`, error);
      break;
    case ErrorLevel.Error:
    default:
      console.error(logMessage, error);
      break;
  }
}

/**
 * Show error toast notification
 */
function showErrorToast(
  options: Partial<ErrorHandlingOptions>
): void {
  if (!options.message) return;
  
  const { level, toastId, toastTitle } = options;
  
  // Determine toast variant based on error level
  let variant: 'default' | 'destructive' = 'default';
  if (level === ErrorLevel.Error || level === ErrorLevel.Critical) {
    variant = 'destructive';
  }
  
  // Show toast with appropriate styling
  toast({
    ...(toastId ? { id: toastId } : {}),
    title: toastTitle || getToastTitleForErrorLevel(level || ErrorLevel.Error),
    description: options.message,
    variant
  });
}

/**
 * Get appropriate toast title based on error level
 */
function getToastTitleForErrorLevel(level: ErrorLevel): string {
  switch (level) {
    case ErrorLevel.Debug:
      return 'Debug Information';
    case ErrorLevel.Info:
      return 'Information';
    case ErrorLevel.Warning:
      return 'Warning';
    case ErrorLevel.Critical:
      return 'Critical Error';
    case ErrorLevel.Error:
    default:
      return 'Error';
  }
}

/**
 * Report error to analytics service
 */
function reportErrorToAnalytics(
  error: Error,
  options: Partial<ErrorHandlingOptions>
): void {
  // This is a placeholder for reporting to actual analytics services
  if (typeof window !== 'undefined' && 'gtag' in window && typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'error', {
        event_category: options.source || ErrorSource.Unknown,
        event_label: options.message,
        value: 1
      });
    } catch (e) {
      console.error('Failed to report to analytics:', e);
    }
  }
}

/**
 * Creates an error handler function with predefined context
 */
export function createErrorHandler(
  componentName: string,
  defaultOptions?: Partial<ErrorHandlingOptions>
) {
  return (error: unknown, options?: Partial<ErrorHandlingOptions>): void => {
    handleError(error, {
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
 * Creates a component-specific error handler
 */
export function createComponentErrorHandler(componentName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return createErrorHandler(componentName, { 
    ...defaultOptions, 
    source: ErrorSource.Component
  });
}

/**
 * Creates a hook-specific error handler
 */
export function createHookErrorHandler(hookName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return createErrorHandler(hookName, { 
    ...defaultOptions, 
    source: ErrorSource.Hook
  });
}

/**
 * Creates a service-specific error handler
 */
export function createServiceErrorHandler(serviceName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return createErrorHandler(serviceName, { 
    ...defaultOptions, 
    source: ErrorSource.Service
  });
}
