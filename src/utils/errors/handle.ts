
/**
 * Error handling utilities 
 */
import { toast } from "@/hooks/use-toast";
import { ErrorHandlingOptions, ErrorLevel } from './types';
import { convertErrorOptions, LegacyErrorHandlingOptions } from './compatibility';

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
 * @param userMessage A user-friendly message to display
 * @param options Additional options for error handling
 */
export function handleError(
  error: unknown,
  userMessage?: string,
  options?: Partial<ErrorHandlingOptions> | LegacyErrorHandlingOptions
): void {
  // Convert legacy options if needed
  const convertedOptions = convertErrorOptions(options as LegacyErrorHandlingOptions);
  const opts: ErrorHandlingOptions = { ...defaultOptions, ...convertedOptions };
  
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Always log to console with appropriate level
  switch (opts.level) {
    case ErrorLevel.Debug:
      console.debug(`[DEBUG] ${userMessage || errorObj.message}`, errorObj, opts.context);
      break;
    case ErrorLevel.Info:
      console.info(`[INFO] ${userMessage || errorObj.message}`, errorObj, opts.context);
      break;
    case ErrorLevel.Warning:
      console.warn(`[WARNING] ${userMessage || errorObj.message}`, errorObj, opts.context);
      break;
    case ErrorLevel.Error:
    default:
      console.error(`[ERROR] ${userMessage || errorObj.message}`, errorObj, opts.context);
  }
  
  // Show toast notification if enabled
  // This doesn't call the hook directly - it calls a function that will
  // use the global toast instance when available
  if (opts.showToast && !opts.silent) {
    const toastId = opts.fingerprint ? `error-${opts.fingerprint}` : undefined;
    
    // Call the safe toast function that doesn't use hooks directly
    toast({
      id: toastId,
      title: opts.toastTitle || (opts.level === ErrorLevel.Error ? 'Error' : opts.level === ErrorLevel.Warning ? 'Warning' : 'Notice'),
      description: userMessage || errorObj.message,
      variant: opts.level === ErrorLevel.Error ? 'destructive' : 'default',
    });
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
    context: { source: 'component', component: componentName }
  });
}

/**
 * Creates a hook-specific error handler
 */
export function createHookErrorHandler(hookName: string) {
  return createErrorHandler(hookName, {
    level: ErrorLevel.Error,
    context: { source: 'hook', hook: hookName }
  });
}

/**
 * Creates a service-specific error handler
 */
export function createServiceErrorHandler(serviceName: string) {
  return createErrorHandler(serviceName, {
    level: ErrorLevel.Error,
    context: { source: 'service', service: serviceName }
  });
}
