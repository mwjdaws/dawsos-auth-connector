
/**
 * Error handling core functionality
 * 
 * This file provides the central error handling functionality for the application.
 * It exports functions for handling errors with different contexts and options.
 */
import { toast } from '@/hooks/use-toast';
import { ErrorLevel, ErrorSource, ErrorHandlingOptions, ContextualError } from './types';
import { formatErrorMessage, getUserFriendlyMessage } from './format';
import { categorizeError } from './categorize';
import { convertErrorOptions } from './compatibility';
import { isErrorDuplicate, storeErrorFingerprint } from './deduplication';
import { generateFingerprint } from './generateId';

// Default error options
const DEFAULT_OPTIONS: Partial<ErrorHandlingOptions> = {
  level: ErrorLevel.Error,
  source: ErrorSource.Unknown,
  message: 'An error occurred',
  showToast: true
};

/**
 * Central error handler for the application
 * 
 * @param error The error to handle
 * @param options Error handling options or message string
 * @returns The handled error for chaining
 */
export function handleError(
  error: unknown,
  options?: Partial<ErrorHandlingOptions> | string
): Error {
  try {
    // Convert options if they're in the legacy format or a string
    const convertedOptions = convertErrorOptions(options);
    
    // Merge with default options
    const fullOptions: ErrorHandlingOptions = {
      ...DEFAULT_OPTIONS,
      ...convertedOptions
    };
    
    // If source is not specified, try to categorize the error
    if (fullOptions.source === ErrorSource.Unknown) {
      fullOptions.source = categorizeError(error);
    }
    
    // Generate a fingerprint for deduplication if not provided
    if (!fullOptions.fingerprint) {
      fullOptions.fingerprint = generateFingerprint(error, fullOptions);
    }
    
    // Check if this is a duplicate error we should skip
    if (isErrorDuplicate(fullOptions.fingerprint)) {
      // Still return the error but don't show toast or report
      return error instanceof Error ? error : new Error(String(error));
    }
    
    // Store the fingerprint to avoid future duplicates
    storeErrorFingerprint(fullOptions.fingerprint);
    
    // Show toast notification unless suppressed
    if (fullOptions.showToast && !fullOptions.suppressToast && !fullOptions.silent) {
      const toastTitle = fullOptions.toastTitle || getUserFriendlyMessage(fullOptions.level);
      const toastMessage = formatErrorMessage(error, fullOptions.message);
      
      toast({
        title: toastTitle,
        description: toastMessage,
        variant: fullOptions.level === ErrorLevel.Error || 
                 fullOptions.level === ErrorLevel.Critical 
                 ? 'destructive' : 'default',
        id: fullOptions.toastId
      });
    }
    
    // Log error to console with context
    if (!fullOptions.silent) {
      console.error(
        `[${fullOptions.source}][${fullOptions.level}] ${fullOptions.message || ''}`,
        error,
        fullOptions.context || {}
      );
    }
    
    // Add context to error if possible
    if (error instanceof Error) {
      const contextualError = error as ContextualError;
      contextualError.context = fullOptions.context || {};
      contextualError.source = fullOptions.source;
      contextualError.level = fullOptions.level;
      return contextualError;
    }
    
    // Return original error or create new one if not an Error instance
    return error instanceof Error ? error : new Error(String(error));
  } catch (handlerError) {
    // If the error handler itself fails, log to console and return original error
    console.error('Error in handleError:', handlerError);
    return error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * Safe version of handleError that catches any errors in the handler itself
 */
export function handleErrorSafe(
  error: unknown,
  options?: Partial<ErrorHandlingOptions> | string
): Error {
  try {
    return handleError(error, options);
  } catch (handlerError) {
    console.error('Error in handleError:', handlerError);
    return error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * Create a component-specific error handler
 */
export function createComponentErrorHandler(componentName: string) {
  return (error: unknown, options?: Partial<ErrorHandlingOptions> | string) => {
    const componentOptions = typeof options === 'string'
      ? { message: options, source: ErrorSource.Component, context: { componentName } }
      : { 
          ...options, 
          source: ErrorSource.Component,
          context: { 
            ...options?.context,
            componentName 
          }
        };
    
    return handleError(error, componentOptions);
  };
}

/**
 * Create a hook-specific error handler
 */
export function createHookErrorHandler(hookName: string) {
  return (error: unknown, options?: Partial<ErrorHandlingOptions> | string) => {
    const hookOptions = typeof options === 'string'
      ? { message: options, source: ErrorSource.Hook, context: { hookName } }
      : { 
          ...options, 
          source: ErrorSource.Hook,
          context: { 
            ...options?.context,
            hookName 
          }
        };
    
    return handleError(error, hookOptions);
  };
}

/**
 * Create a service-specific error handler
 */
export function createServiceErrorHandler(serviceName: string) {
  return (error: unknown, options?: Partial<ErrorHandlingOptions> | string) => {
    const serviceOptions = typeof options === 'string'
      ? { message: options, source: ErrorSource.Service, context: { serviceName } }
      : { 
          ...options, 
          source: ErrorSource.Service,
          context: { 
            ...options?.context,
            serviceName 
          }
        };
    
    return handleError(error, serviceOptions);
  };
}

/**
 * Create a generic error handler with predefined options
 */
export function createErrorHandler(defaultOptions: Partial<ErrorHandlingOptions>) {
  return (error: unknown, options?: Partial<ErrorHandlingOptions> | string) => {
    const specificOptions = typeof options === 'string'
      ? { ...defaultOptions, message: options }
      : { ...defaultOptions, ...options };
    
    return handleError(error, specificOptions);
  };
}

// For backward compatibility, export handleError as default
export default handleError;
