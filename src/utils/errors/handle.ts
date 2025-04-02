
import { toast } from '@/hooks/use-toast';
import { ErrorLevel, ErrorSource, ErrorHandlingOptions } from './types';
import { generateFingerprint } from './deduplication';
import { formatErrorForLogging, formatErrorForUser } from './formatter';
import { isErrorIgnored, isErrorLevelMet } from './filtering';
import { trackError, getDuplicateCount } from './tracking';

/**
 * Centralized error handling function.
 * 
 * This is the main entry point for error handling in the application.
 * It processes errors consistently, with optional deduplication,
 * proper formatting, and appropriate user feedback.
 * 
 * @param error The error object or message
 * @param optionsOrMessage Error handling options or a user-friendly message
 */
export function handleError(
  error: Error | unknown,
  optionsOrMessage?: string | Partial<ErrorHandlingOptions>
): void {
  // Set default options
  const errorOptions: ErrorHandlingOptions = {
    level: ErrorLevel.Error,
    source: ErrorSource.Unknown,
    message: typeof error === 'string' ? error : undefined,
    context: {},
    reportToAnalytics: true,
    showToast: true,
    suppressToast: false,
    silent: false,
    fingerprint: undefined,
    toastId: undefined,
    toastTitle: undefined
  };

  // Process options parameter
  if (typeof optionsOrMessage === 'string') {
    // String option is treated as a user-friendly message
    errorOptions.message = optionsOrMessage;
  } else if (optionsOrMessage) {
    // Merge provided options with defaults
    Object.assign(errorOptions, optionsOrMessage);
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
  
  // Skip if error level doesn't meet threshold
  if (!isErrorLevelMet(errorOptions.level)) {
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
      (errorOptions.level === ErrorLevel.Warning ? 'Warning' : 
        errorOptions.level === ErrorLevel.Critical ? 'Critical Error' : 'Error');
    
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
 * Create component-specific error handler
 */
export function createComponentErrorHandler(componentName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return (error: Error | unknown, optionsOrMessage?: string | Partial<ErrorHandlingOptions>): void => {
    const mergedOptions = typeof optionsOrMessage === 'string' 
      ? { message: optionsOrMessage } 
      : optionsOrMessage || {};
      
    handleError(error, {
      ...defaultOptions,
      ...mergedOptions,
      source: ErrorSource.Component,
      context: {
        ...(defaultOptions?.context || {}),
        ...(mergedOptions.context || {}),
        componentName
      }
    });
  };
}

/**
 * Create hook-specific error handler
 */
export function createHookErrorHandler(hookName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return (error: Error | unknown, optionsOrMessage?: string | Partial<ErrorHandlingOptions>): void => {
    const mergedOptions = typeof optionsOrMessage === 'string' 
      ? { message: optionsOrMessage } 
      : optionsOrMessage || {};
      
    handleError(error, {
      ...defaultOptions,
      ...mergedOptions,
      source: ErrorSource.Hook,
      context: {
        ...(defaultOptions?.context || {}),
        ...(mergedOptions.context || {}),
        hookName
      }
    });
  };
}

/**
 * Create service-specific error handler
 */
export function createServiceErrorHandler(serviceName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return (error: Error | unknown, optionsOrMessage?: string | Partial<ErrorHandlingOptions>): void => {
    const mergedOptions = typeof optionsOrMessage === 'string' 
      ? { message: optionsOrMessage } 
      : optionsOrMessage || {};
      
    handleError(error, {
      ...defaultOptions,
      ...mergedOptions,
      source: ErrorSource.Service,
      context: {
        ...(defaultOptions?.context || {}),
        ...(mergedOptions.context || {}),
        serviceName
      }
    });
  };
}

// General error handler creator
export function createErrorHandler(
  source: ErrorSource,
  contextName: string,
  defaultOptions?: Partial<ErrorHandlingOptions>
) {
  return (error: Error | unknown, optionsOrMessage?: string | Partial<ErrorHandlingOptions>): void => {
    const mergedOptions = typeof optionsOrMessage === 'string' 
      ? { message: optionsOrMessage } 
      : optionsOrMessage || {};
      
    handleError(error, {
      ...defaultOptions,
      ...mergedOptions,
      source,
      context: {
        ...(defaultOptions?.context || {}),
        ...(mergedOptions.context || {}),
        [source === ErrorSource.Component ? 'componentName' : 
         source === ErrorSource.Hook ? 'hookName' : 
         source === ErrorSource.Service ? 'serviceName' : 'name']: contextName
      }
    });
  };
}

// Export as default for ES modules
export default handleError;
