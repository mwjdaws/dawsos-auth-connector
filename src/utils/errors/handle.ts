
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
export default function handleError(
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
  if (isErrorIgnored(error, fingerprint)) {
    return;
  }
  
  // Track the occurrence
  const occurrenceCount = trackError(fingerprint);
  
  // Format the error for logging
  const logData = formatErrorForLogging(errorObject, {
    level: errorOptions.level,
    source: errorOptions.source,
    context: errorOptions.context,
    fingerprint: fingerprint
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
      id: errorOptions.toastId
    });
  }
  
  // TODO: Report to analytics service if configured
  if (errorOptions.reportToAnalytics && !errorOptions.silent) {
    // Analytics reporting would go here
  }
}

/**
 * Legacy function signature for backward compatibility.
 * This allows existing code to continue working while
 * gradually migrating to the new signature.
 */
export function handleError(
  error: Error | unknown,
  message: string,
  options?: LegacyErrorHandlingOptions
): void;

/**
 * New function signature.
 * This is the preferred way to call handleError.
 */
export function handleError(
  error: Error | unknown,
  options?: string | ErrorHandlingOptions
): void;

/**
 * Implementation that handles both signatures.
 */
export function handleError(
  error: Error | unknown,
  messageOrOptions?: string | ErrorHandlingOptions,
  legacyOptions?: LegacyErrorHandlingOptions
): void {
  // Handle legacy signature (error, message, options)
  if (typeof messageOrOptions === 'string' && legacyOptions !== undefined) {
    const options: ErrorHandlingOptions = {
      message: messageOrOptions,
      level: legacyOptions.level || ErrorLevel.Error,
      source: legacyOptions.source || ErrorSource.Unknown,
      context: legacyOptions.context,
      silent: legacyOptions.silent,
      showToast: legacyOptions.showToast,
      toastId: legacyOptions.toastId,
      reportToAnalytics: legacyOptions.reportToAnalytics
    };
    
    // Call the implementation with the normalized options
    return handleError(error, options);
  }
  
  // Handle new signature (error, options)
  return handleError(error, messageOrOptions);
}
