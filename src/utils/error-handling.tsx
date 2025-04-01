
/**
 * Central error handling utility
 */
import { toast } from '@/hooks/use-toast';
import { ErrorLevel, ErrorSource, ErrorHandlingOptions } from '@/utils/errors/types';

/**
 * Default error handling options
 */
const defaultOptions: ErrorHandlingOptions = {
  level: ErrorLevel.ERROR,
  silent: false,
  reportToAnalytics: true,
  showToast: true
};

/**
 * Handle an error with consistent logging, reporting, and user feedback
 * 
 * @param error The error to handle
 * @param options Additional options for error handling
 */
export function handleError(
  error: unknown,
  options?: Partial<ErrorHandlingOptions>
): void {
  const opts = { ...defaultOptions, ...options };
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Get user-friendly message - either from options or from the error
  const userMessage = opts.toastTitle || errorObj.message;
  
  // Always log to console with appropriate level
  switch (opts.level) {
    case ErrorLevel.DEBUG:
      console.debug(`[DEBUG] ${userMessage}`, errorObj, opts.context);
      break;
    case ErrorLevel.INFO:
      console.info(`[INFO] ${userMessage}`, errorObj, opts.context);
      break;
    case ErrorLevel.WARNING:
      console.warn(`[WARNING] ${userMessage}`, errorObj, opts.context);
      break;
    case ErrorLevel.ERROR:
    default:
      console.error(`[ERROR] ${userMessage}`, errorObj, opts.context);
  }
  
  // Show toast notification if enabled
  if (opts.showToast && !opts.silent) {
    toast({
      title: opts.toastTitle || (opts.level === ErrorLevel.ERROR 
        ? 'Error' 
        : opts.level === ErrorLevel.WARNING 
          ? 'Warning' 
          : 'Notice'),
      description: opts.message || errorObj.message,
      variant: opts.level === ErrorLevel.ERROR ? 'destructive' : 'default',
    });
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
    source: ErrorSource.UI 
  });
}

/**
 * Creates a hook-specific error handler
 */
export function createHookErrorHandler(hookName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return createErrorHandler(hookName, { 
    ...defaultOptions, 
    source: ErrorSource.UI 
  });
}

/**
 * Creates a service-specific error handler
 */
export function createServiceErrorHandler(serviceName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return createErrorHandler(serviceName, { 
    ...defaultOptions, 
    source: ErrorSource.API 
  });
}
