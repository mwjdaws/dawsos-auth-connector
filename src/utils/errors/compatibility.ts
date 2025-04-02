
import { handleError } from './handle';
import { ErrorLevel, ErrorSource, LegacyErrorHandlingOptions } from './types';

/**
 * Legacy interface for handleError for backward compatibility.
 * This is for transitioning from the old error handling pattern to the new one.
 * 
 * @deprecated Use handleError(error, { options }) pattern instead
 */
export function legacyHandleError(
  error: Error | unknown,
  message: string,
  options?: LegacyErrorHandlingOptions
): void {
  // Convert legacy options to new format
  handleError(error, {
    message,
    level: options?.level,
    source: options?.source,
    context: options?.context,
    silent: options?.silent,
    showToast: options?.showToast,
    toastId: options?.toastId,
    reportToAnalytics: options?.reportToAnalytics
  });
}

// Legacy export for backward compatibility
export const handleErrorWithMessage = legacyHandleError;

/**
 * Create an error with additional context for better debugging
 * 
 * @deprecated Use Error directly and pass context in handleError options
 */
export function createContextualError(
  message: string,
  context?: Record<string, any>,
  source?: ErrorSource
): Error {
  const error = new Error(message);
  if (context) {
    (error as any).context = context;
  }
  if (source) {
    (error as any).source = source;
  }
  return error;
}

// Re-export enums for legacy code
export { ErrorLevel, ErrorSource };
