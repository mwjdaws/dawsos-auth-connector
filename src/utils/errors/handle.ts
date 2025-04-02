
/**
 * Error handling utilities
 */
import { toast } from '@/hooks/use-toast';
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './types';
import { formatErrorMessage } from './format';
import { isErrorDuplicate, storeErrorFingerprint, generateFingerprint } from './deduplication';
import { convertErrorOptions } from './compatibility';

/**
 * Default error handling options
 */
const defaultOptions: Partial<ErrorHandlingOptions> = {
  level: ErrorLevel.Error,
  source: ErrorSource.Unknown,
  silent: false,
  reportToAnalytics: true,
  showToast: true
};

/**
 * Handle an error with consistent logging, reporting, and user feedback
 * 
 * @param error The error to handle
 * @param userMessage A user-friendly message to display
 * @param options Additional options for error handling
 */
export function handleError(
  error: unknown,
  userMessage?: string | Partial<ErrorHandlingOptions>,
  options?: Partial<ErrorHandlingOptions>
): void {
  try {
    // Convert legacy options if needed
    let opts: Partial<ErrorHandlingOptions>;
    
    if (typeof userMessage === 'string') {
      opts = { 
        ...defaultOptions, 
        ...(options || {}),
        message: userMessage 
      };
    } else {
      opts = { 
        ...defaultOptions, 
        ...(userMessage || {})
      };
    }
    
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    // Ensure we have a message
    if (!opts.message) {
      opts.message = formatErrorMessage(error);
    }
    
    // Check for duplicate errors
    const fingerprint = opts.fingerprint || generateFingerprint(error, opts);
    if (fingerprint && isErrorDuplicate(fingerprint)) {
      // Skip duplicate error
      return;
    }
    
    // Store error fingerprint to avoid duplicates
    if (fingerprint) {
      storeErrorFingerprint(fingerprint);
    }
    
    // Always log to console with appropriate level
    switch (opts.level) {
      case ErrorLevel.Debug:
        console.debug(`[DEBUG] ${opts.message || errorObj.message}`, errorObj, opts.context);
        break;
      case ErrorLevel.Info:
        console.info(`[INFO] ${opts.message || errorObj.message}`, errorObj, opts.context);
        break;
      case ErrorLevel.Warning:
        console.warn(`[WARNING] ${opts.message || errorObj.message}`, errorObj, opts.context);
        break;
      case ErrorLevel.Error:
      default:
        console.error(`[ERROR] ${opts.message || errorObj.message}`, errorObj, opts.context);
    }
    
    // Show toast notification if enabled
    if (opts.showToast && !opts.silent) {
      const toastId = opts.fingerprint ? `error-${opts.fingerprint}` : undefined;
      
      toast({
        ...(toastId ? { id: toastId } : {}),
        title: opts.toastTitle || (opts.level === ErrorLevel.Error ? 'Error' : 
               opts.level === ErrorLevel.Warning ? 'Warning' : 'Notice'),
        description: opts.message || errorObj.message,
        variant: opts.level === ErrorLevel.Error ? 'destructive' : 'default',
      });
    }
    
    // Report to analytics if enabled
    if (opts.reportToAnalytics) {
      // Placeholder for analytics reporting
      if (typeof window !== 'undefined' && window.gtag) {
        try {
          window.gtag('event', 'error', {
            event_category: opts.source || ErrorSource.Unknown,
            event_label: opts.message,
            value: 1
          });
        } catch (e) {
          console.error('Failed to report to analytics:', e);
        }
      }
    }
  } catch (handlingError) {
    console.error('[CRITICAL] Error occurred during error handling:', handlingError);
    console.error('Original error:', error);
  }
}

/**
 * Safe error handler that catches and handles any errors during error handling
 */
export function handleErrorSafe(
  error: unknown,
  userMessage?: string,
  options?: Partial<ErrorHandlingOptions>
): void {
  try {
    handleError(error, userMessage, options);
  } catch (handlingError) {
    console.error('[CRITICAL] Error occurred during error handling:', handlingError);
    console.error('Original error:', error);
  }
}

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
  return (error: unknown, userMessage?: string | undefined, options?: Partial<ErrorHandlingOptions> | undefined): void => {
    handleError(error, userMessage, {
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
export function createComponentErrorHandler(componentName: string) {
  return createErrorHandler(componentName, { 
    level: ErrorLevel.Error,
    source: ErrorSource.Component
  });
}

/**
 * Creates a hook-specific error handler
 */
export function createHookErrorHandler(hookName: string) {
  return createErrorHandler(hookName, {
    level: ErrorLevel.Error,
    source: ErrorSource.Hook
  });
}

/**
 * Creates a service-specific error handler
 */
export function createServiceErrorHandler(serviceName: string) {
  return createErrorHandler(serviceName, {
    level: ErrorLevel.Error,
    source: ErrorSource.API
  });
}
