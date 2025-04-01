
/**
 * Error Handling Utility
 */
import { toast } from '@/hooks/use-toast';
import { ErrorLevel, ErrorSource, ErrorHandlingOptions } from './errors/types';
import { formatErrorMessage } from './errors/format';
import { categorizeError } from './errors/categorize';
import { convertLegacyOptions } from './errors/compatibility';
import { isErrorDuplicate, storeErrorFingerprint } from './errors/deduplication';

// Default error options
const defaultErrorOptions: ErrorHandlingOptions = {
  level: ErrorLevel.Error,
  source: ErrorSource.Unknown,
  reportToAnalytics: true,
  showToast: true,
  silent: false
};

/**
 * Main error handling function
 * 
 * @param error The error to handle
 * @param message Optional error message
 * @param options Additional error handling options
 */
export function handleError(
  error: unknown,
  message?: string,
  options?: Partial<ErrorHandlingOptions>
): void {
  try {
    // Convert legacy options if needed
    const processedOptions = typeof options === 'string' 
      ? { level: options as ErrorLevel } 
      : options;
    
    // Merge with default options
    const mergedOptions: ErrorHandlingOptions = {
      ...defaultErrorOptions,
      ...processedOptions
    };
    
    // Set message if provided
    if (message) {
      mergedOptions.message = message;
    }
    
    // Try to categorize the error if source is not specified
    if (!mergedOptions.source || mergedOptions.source === ErrorSource.Unknown) {
      mergedOptions.source = categorizeError(error);
    }
    
    // Format error message for display
    const formattedMessage = formatErrorMessage(error, mergedOptions.message);
    
    // Check for duplicate errors
    const fingerprint = mergedOptions.fingerprint || formattedMessage;
    if (isErrorDuplicate(fingerprint)) {
      // Skip duplicate error
      return;
    }
    
    // Store error fingerprint to avoid duplicates
    storeErrorFingerprint(fingerprint);
    
    // Log error to console based on level
    if (!mergedOptions.silent) {
      logErrorToConsole(error, formattedMessage, mergedOptions);
    }
    
    // Show toast notification if enabled
    if (mergedOptions.showToast && !mergedOptions.suppressToast) {
      showErrorToast(formattedMessage, mergedOptions);
    }
    
    // Report to analytics if enabled
    if (mergedOptions.reportToAnalytics) {
      reportErrorToAnalytics(error, formattedMessage, mergedOptions);
    }
  } catch (handlerError) {
    // Fallback error handling if the error handler itself fails
    console.error('Error in error handler:', handlerError);
    console.error('Original error:', error);
    
    // Show a fallback toast
    toast({
      title: 'An error occurred',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive',
    });
  }
}

/**
 * Log error to console with appropriate level
 */
function logErrorToConsole(
  error: unknown,
  message: string,
  options: ErrorHandlingOptions
): void {
  const { level, source, context } = options;
  
  const contextString = context 
    ? `\nContext: ${JSON.stringify(context)}`
    : '';
  
  const logMessage = `[${source}] ${message}${contextString}`;
  
  switch (level) {
    case ErrorLevel.Debug:
      console.debug(logMessage, error);
      break;
    case ErrorLevel.Info:
      console.info(logMessage, error);
      break;
    case ErrorLevel.Warning:
      console.warn(logMessage, error);
      break;
    case ErrorLevel.Error:
    default:
      console.error(logMessage, error);
      break;
  }
}

/**
 * Show error toast notification
 */
function showErrorToast(
  message: string,
  options: ErrorHandlingOptions
): void {
  const { level, toastId } = options;
  
  // Determine toast variant based on error level
  let variant: 'default' | 'destructive' = 'default';
  if (level === ErrorLevel.Error) {
    variant = 'destructive';
  }
  
  // Show toast with appropriate styling
  toast({
    id: toastId,
    title: options.toastTitle || getToastTitleForErrorLevel(level),
    description: message,
    variant
  });
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
    case ErrorLevel.Error:
    default:
      return 'Error';
  }
}

/**
 * Report error to analytics service
 */
function reportErrorToAnalytics(
  error: unknown,
  message: string,
  options: ErrorHandlingOptions
): void {
  // This is a placeholder for reporting to actual analytics services
  // Implementation will depend on the analytics service being used
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'error', {
      event_category: options.source || ErrorSource.UI,
      event_label: message,
      value: 1
    });
  }
}
