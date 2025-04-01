
/**
 * Central error handling utility
 */
import { ErrorLevel, ErrorSource, ErrorHandlingOptions } from '@/utils/errors/types';

/**
 * Default error handling options
 */
const defaultOptions: ErrorHandlingOptions = {
  level: ErrorLevel.Error,
  silent: false,
  reportToAnalytics: true,
  showToast: true
};

/**
 * Handle an error with consistent logging, reporting, and user feedback
 * 
 * @param error The error to handle
 * @param messageOrOptions A message string or options for error handling
 * @param optionsObj Additional options for error handling
 */
export function handleError(
  error: unknown,
  messageOrOptions?: string | Partial<ErrorHandlingOptions>,
  optionsObj?: Partial<ErrorHandlingOptions>
): void {
  // Process arguments to support both forms:
  // handleError(error, "Message")
  // handleError(error, { options })
  let options: Partial<ErrorHandlingOptions>;
  
  if (typeof messageOrOptions === 'string') {
    options = { 
      ...defaultOptions,
      message: messageOrOptions,
      ...optionsObj 
    };
  } else {
    options = { 
      ...defaultOptions,
      ...messageOrOptions 
    };
  }
  
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Get user-friendly message - either from options or from the error
  const userMessage = options.toastTitle || errorObj.message;
  
  // Always log to console with appropriate level
  switch (options.level) {
    case ErrorLevel.Debug:
      console.debug(`[DEBUG] ${userMessage}`, errorObj, options.context);
      break;
    case ErrorLevel.Info:
      console.info(`[INFO] ${userMessage}`, errorObj, options.context);
      break;
    case ErrorLevel.Warning:
      console.warn(`[WARNING] ${userMessage}`, errorObj, options.context);
      break;
    case ErrorLevel.Error:
    default:
      console.error(`[ERROR] ${userMessage}`, errorObj, options.context);
  }
  
  // Toast notifications need to be shown from within components
  // Here we just log that a toast would be shown
  if (options.showToast && !options.silent) {
    console.info(`[TOAST] Would show toast: ${options.toastTitle || (options.level === ErrorLevel.Error 
      ? 'Error' 
      : options.level === ErrorLevel.Warning 
        ? 'Warning' 
        : 'Notice')} - ${options.message || errorObj.message}`);
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
