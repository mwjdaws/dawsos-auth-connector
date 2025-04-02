
import { toast } from '@/hooks/use-toast';
import { ErrorLevel, ErrorSource, ErrorHandlingOptions, LegacyErrorHandlingOptions } from './types';
import { generateFingerprint } from './deduplication';
import { formatErrorForLogging, formatErrorForUser } from './formatter';
import { isErrorIgnored } from './filtering';
import { trackError, getDuplicateCount } from './tracking';

/**
 * Centralized error handling function.
 * 
 * This is the main entry point for error handling in the application.
 * It processes errors consistently, with optional deduplication,
 * proper formatting, and appropriate user feedback.
 * 
 * @param error The error object or message
 * @param options Error handling options or a user-friendly message
 */
export function handleError(
  error: Error | unknown,
  options?: string | ErrorHandlingOptions
): void {
  // Set default options
  let errorOptions: ErrorHandlingOptions = {
    level: ErrorLevel.Error,
    source: ErrorSource.Unknown,
    message: typeof error === 'string' ? error : undefined,
    context: {},
    reportToAnalytics: true,
    showToast: true,
    suppressToast: false,
    silent: false
  };

  // Process options parameter
  if (typeof options === 'string') {
    // String option is treated as a user-friendly message
    errorOptions.message = options;
  } else if (options) {
    // Merge provided options with defaults
    errorOptions = {
      ...errorOptions,
      ...options
    };
  }

  // Extract actual error object
  const errorObject = typeof error === 'string' 
    ? new Error(error) 
    : (error instanceof Error ? error : new Error(String(error)));

  // Generate a fingerprint for deduplication
  const fingerprint = errorOptions.fingerprint || 
    generateFingerprint(errorObject, errorOptions.message, errorOptions.source);
  
  // Skip if error is configured to be ignored
  if (isErrorIgnored(fingerprint)) {
    return;
  }
  
  // Track the occurrence
  const occurrenceCount = trackError(fingerprint);
  
  // Format the error for logging
  const logData = formatErrorForLogging(errorObject, {
    level: errorOptions.level,
    source: errorOptions.source,
    context: errorOptions.context || {},
    fingerprint
  });
  
  // Log to console based on level
  if (!errorOptions.silent) {
    if (errorOptions.level === ErrorLevel.Debug) {
      console.debug('[ERROR]', logData);
    } else if (errorOptions.level === ErrorLevel.Info) {
      console.info('[ERROR]', logData);
    } else if (errorOptions.level === ErrorLevel.Warning) {
      console.warn('[ERROR]', logData);
    } else {
      console.error('[ERROR]', logData);
    }
  }
  
  // Show toast notification if configured
  if (errorOptions.showToast && !errorOptions.suppressToast && !errorOptions.silent) {
    const title = errorOptions.toastTitle || 
      (errorOptions.level === ErrorLevel.Warning ? 'Warning' : 'Error');
    
    const description = formatErrorForUser(
      errorObject, 
      errorOptions.message,
      occurrenceCount
    );
    
    toast({
      title,
      description,
      variant: errorOptions.level === ErrorLevel.Critical ? 'destructive' : 'default',
      ...(errorOptions.toastId ? { id: errorOptions.toastId } : {})
    });
  }
  
  // TODO: Report to analytics service if configured
  if (errorOptions.reportToAnalytics && !errorOptions.silent) {
    // Analytics reporting would go here
  }
}

/**
 * Legacy error handler function for backward compatibility
 */
export function handleErrorLegacy(
  error: Error | unknown,
  message: string,
  options?: LegacyErrorHandlingOptions
): void {
  // Convert legacy options to new format
  handleError(error, {
    message,
    level: options?.level || ErrorLevel.Error,
    source: options?.source || ErrorSource.Unknown,
    context: options?.context,
    silent: options?.silent,
    showToast: options?.showToast,
    toastId: options?.toastId,
    reportToAnalytics: options?.reportToAnalytics
  });
}

/**
 * Create component-specific error handler
 */
export function createComponentErrorHandler(componentName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return (error: Error | unknown, options?: string | ErrorHandlingOptions): void => {
    const mergedOptions = typeof options === 'string' 
      ? { message: options, source: ErrorSource.Component } 
      : { ...options, source: ErrorSource.Component };
      
    handleError(error, {
      ...defaultOptions,
      ...mergedOptions,
      context: {
        ...(defaultOptions?.context || {}),
        ...(typeof options === 'object' ? options.context || {} : {}),
        componentName
      }
    });
  };
}

/**
 * Create hook-specific error handler
 */
export function createHookErrorHandler(hookName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return (error: Error | unknown, options?: string | ErrorHandlingOptions): void => {
    const mergedOptions = typeof options === 'string' 
      ? { message: options, source: ErrorSource.Hook } 
      : { ...options, source: ErrorSource.Hook };
      
    handleError(error, {
      ...defaultOptions,
      ...mergedOptions,
      context: {
        ...(defaultOptions?.context || {}),
        ...(typeof options === 'object' ? options.context || {} : {}),
        hookName
      }
    });
  };
}

/**
 * Create service-specific error handler
 */
export function createServiceErrorHandler(serviceName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return (error: Error | unknown, options?: string | ErrorHandlingOptions): void => {
    const mergedOptions = typeof options === 'string' 
      ? { message: options, source: ErrorSource.Service } 
      : { ...options, source: ErrorSource.Service };
      
    handleError(error, {
      ...defaultOptions,
      ...mergedOptions,
      context: {
        ...(defaultOptions?.context || {}),
        ...(typeof options === 'object' ? options.context || {} : {}),
        serviceName
      }
    });
  };
}

// Export as default for ES modules
export default handleError;
