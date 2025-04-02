
import { toast } from '@/hooks/use-toast';
import { 
  ErrorHandlingOptions, 
  ErrorLevel, 
  ErrorSource,
  LegacyErrorHandlingOptions
} from './types';
import { generateFingerprint } from './deduplication';
import { formatErrorForLogging, formatErrorForUser } from './formatter';
import { isErrorIgnored } from './filtering';
import { getDuplicateCount, trackError } from './tracking';

// Error history for deduplication
const recentErrors = new Map<string, { timestamp: number, count: number }>();

/**
 * Log and handle an error with standardized processing
 *
 * This function provides a central place to handle all errors in the application:
 * - Log the error with appropriate context
 * - Show a toast notification for user feedback
 * - Track the error for analytics (optional)
 * - Apply error deduplication to prevent notification spam
 *
 * @param error - The error that occurred
 * @param options - Options for how to handle the error
 * 
 * @example
 * ```ts
 * // Modern usage with options object
 * try {
 *   await saveDocument();
 * } catch (err) {
 *   handleError(err, {
 *     message: "Failed to save document",
 *     level: ErrorLevel.Warning,
 *     context: { documentId }
 *   });
 * }
 * 
 * // Legacy usage with message string
 * try {
 *   await saveDocument();
 * } catch (err) {
 *   handleError(err, "Failed to save document");
 * }
 * ```
 */
export function handleError(
  error: Error | unknown,
  optionsOrMessage?: ErrorHandlingOptions | string,
): void {
  // Process the second parameter based on its type to support different call patterns
  const options = normalizeOptions(optionsOrMessage);
  
  // Default to ErrorLevel.Error if no level provided
  const level = options.level || ErrorLevel.Error;
  
  // Default to ErrorSource.Unknown if no source provided
  const source = options.source || ErrorSource.Unknown;
  
  // Fingerprint for deduplication
  const fingerprint = options.fingerprint || generateFingerprint(error, options);
  
  // Check if we should ignore this error
  if (isErrorIgnored(error, fingerprint)) {
    return;
  }
  
  // Format the error for logging
  const formattedError = formatErrorForLogging(error, {
    level,
    source,
    context: options.context,
    fingerprint
  });

  // Log the error with appropriate level
  logErrorWithLevel(level, formattedError);
  
  // Record the error occurrence for deduplication
  trackError(fingerprint);
  
  // Show a toast notification if appropriate
  if (shouldShowToast(options, fingerprint)) {
    const duplicateCount = getDuplicateCount(fingerprint);
    const userMessage = formatErrorForUser(error, options.message, duplicateCount);
    
    toast({
      title: options.toastTitle || getToastTitle(level),
      description: userMessage,
      variant: getToastVariant(level),
      id: options.toastId,
    });
  }

  // Track for analytics if enabled
  if (options.reportToAnalytics) {
    // TODO: Implement analytics tracking
  }
}

/**
 * Normalize options from different call patterns
 */
function normalizeOptions(
  optionsOrMessage?: ErrorHandlingOptions | string
): ErrorHandlingOptions {
  if (typeof optionsOrMessage === 'string') {
    // Legacy usage: handleError(err, "message")
    return { message: optionsOrMessage };
  } else if (optionsOrMessage) {
    // Modern usage: handleError(err, { options })
    return optionsOrMessage;
  }
  
  // No options provided
  return {};
}

/**
 * Log the error with the appropriate console method based on level
 */
function logErrorWithLevel(level: ErrorLevel, formattedError: any): void {
  switch (level) {
    case ErrorLevel.Debug:
      console.debug(formattedError);
      break;
    case ErrorLevel.Info:
      console.info(formattedError);
      break;
    case ErrorLevel.Warning:
      console.warn(formattedError);
      break;
    case ErrorLevel.Critical:
      console.error('CRITICAL:', formattedError);
      break;
    case ErrorLevel.Error:
    default:
      console.error(formattedError);
  }
}

/**
 * Determine if a toast notification should be shown
 */
function shouldShowToast(
  options: ErrorHandlingOptions,
  fingerprint: string
): boolean {
  // Don't show toast if explicitly disabled
  if (options.suppressToast || options.silent) {
    return false;
  }
  
  // Show toast by default for Warning, Error, and Critical levels
  const shouldShowByDefault = 
    !options.level || 
    options.level === ErrorLevel.Warning || 
    options.level === ErrorLevel.Error || 
    options.level === ErrorLevel.Critical;
  
  return options.showToast ?? shouldShowByDefault;
}

/**
 * Get appropriate toast title based on error level
 */
function getToastTitle(level: ErrorLevel): string {
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
 * Get appropriate toast variant based on error level
 */
function getToastVariant(level: ErrorLevel): 'default' | 'destructive' {
  switch (level) {
    case ErrorLevel.Debug:
    case ErrorLevel.Info:
      return 'default';
    case ErrorLevel.Warning:
    case ErrorLevel.Error:
    case ErrorLevel.Critical:
    default:
      return 'destructive';
  }
}

// For compatibility with previous exports
export default handleError;
