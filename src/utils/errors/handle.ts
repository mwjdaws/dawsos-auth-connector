
/**
 * Error handling utilities 
 */
import { toast } from "@/components/ui/use-toast";
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './types';
import { convertErrorOptions, LegacyErrorHandlingOptions } from './compatibility';

/**
 * Default error handling options
 */
const defaultOptions: ErrorHandlingOptions = {
  level: ErrorLevel.Error,
  silent: false,
  reportToAnalytics: true,
  showToast: true,
  source: ErrorSource.Unknown
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
    // Process arguments to handle both forms:
    // handleError(error, "Message", options)
    // handleError(error, options)
    let userMsg: string | undefined;
    let optionsObj: Partial<ErrorHandlingOptions> = {};
    
    if (typeof userMessage === 'string') {
      userMsg = userMessage;
      optionsObj = options || {};
    } else {
      userMsg = undefined;
      optionsObj = userMessage || {};
    }
    
    // Convert legacy options if needed
    const convertedOptions = convertErrorOptions(optionsObj as LegacyErrorHandlingOptions);
    const opts: ErrorHandlingOptions = { ...defaultOptions, ...convertedOptions };
    
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const displayMessage = userMsg || errorObj.message;
    
    // Always log to console with appropriate level
    switch (opts.level) {
      case ErrorLevel.Debug:
        console.debug(`[DEBUG] ${displayMessage}`, errorObj, opts.context);
        break;
      case ErrorLevel.Info:
        console.info(`[INFO] ${displayMessage}`, errorObj, opts.context);
        break;
      case ErrorLevel.Warning:
        console.warn(`[WARNING] ${displayMessage}`, errorObj, opts.context);
        break;
      case ErrorLevel.Critical:
        console.error(`[CRITICAL] ${displayMessage}`, errorObj, opts.context);
        break;
      case ErrorLevel.Error:
      default:
        console.error(`[ERROR] ${displayMessage}`, errorObj, opts.context);
        break;
    }
    
    // Show toast notification if enabled
    if (opts.showToast && !opts.silent && !opts.suppressToast) {
      const toastId = opts.fingerprint ? `error-${opts.fingerprint}` : opts.toastId;
      
      toast({
        id: toastId,
        title: opts.toastTitle || getToastTitleForErrorLevel(opts.level || ErrorLevel.Error),
        description: displayMessage,
        variant: opts.level === ErrorLevel.Error || opts.level === ErrorLevel.Critical ? 'destructive' : 'default',
      });
    }
    
    // Reporting to analytics would go here if implemented
    if (opts.reportToAnalytics && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'error', {
        event_category: opts.source || ErrorSource.Unknown,
        event_label: displayMessage,
        value: 1
      });
    }
  } catch (handlingError) {
    console.error('[CRITICAL] Error occurred during error handling:', handlingError);
    console.error('Original error:', error);
    
    // Show a fallback toast
    toast({
      title: 'Error',
      description: 'An unexpected error occurred.',
      variant: 'destructive',
    });
  }
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
    source: ErrorSource.Component,
    context: { component: componentName }
  });
}

/**
 * Creates a hook-specific error handler
 */
export function createHookErrorHandler(hookName: string) {
  return createErrorHandler(hookName, {
    level: ErrorLevel.Error,
    source: ErrorSource.Hook,
    context: { hook: hookName }
  });
}

/**
 * Creates a service-specific error handler
 */
export function createServiceErrorHandler(serviceName: string) {
  return createErrorHandler(serviceName, {
    level: ErrorLevel.Error,
    source: ErrorSource.Service,
    context: { service: serviceName }
  });
}
