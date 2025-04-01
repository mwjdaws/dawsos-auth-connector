
/**
 * Central error handling utility
 */
import { toast } from '@/hooks/use-toast';
import { ErrorLevel, ErrorSource, ErrorHandlingOptions } from './errors/types';

/**
 * Format an error message for display
 */
function formatErrorMessage(error: unknown, userMessage?: string): string {
  if (userMessage) {
    return userMessage;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

/**
 * Track error fingerprints to avoid duplicates
 */
const recentErrorFingerprints: Set<string> = new Set();

/**
 * Check if an error with the same fingerprint was recently reported
 */
function isErrorDuplicate(fingerprint: string): boolean {
  return recentErrorFingerprints.has(fingerprint);
}

/**
 * Store an error fingerprint to prevent duplicates
 */
function storeErrorFingerprint(fingerprint: string): void {
  recentErrorFingerprints.add(fingerprint);
  
  // Automatically clear fingerprint after 5 seconds
  setTimeout(() => {
    recentErrorFingerprints.delete(fingerprint);
  }, 5000);
}

/**
 * Convert legacy options format to new format
 */
function convertLegacyOptions(options: any): Partial<ErrorHandlingOptions> {
  if (!options) return {};
  if (typeof options === 'string') {
    return { message: options };
  }
  return options as Partial<ErrorHandlingOptions>;
}

// Default error options
const defaultErrorOptions: Partial<ErrorHandlingOptions> = {
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
 * @param messageOrOptions A message string or options for error handling
 * @param optionsObj Additional options for error handling
 */
export function handleError(
  error: unknown,
  messageOrOptions?: string | Partial<ErrorHandlingOptions>,
  optionsObj?: Partial<ErrorHandlingOptions>
): void {
  try {
    // Process arguments to support both forms:
    // handleError(error, "Message")
    // handleError(error, { options })
    let options: Partial<ErrorHandlingOptions>;
    
    if (typeof messageOrOptions === 'string') {
      options = { 
        ...defaultErrorOptions,
        message: messageOrOptions,
        ...optionsObj 
      };
    } else {
      options = { 
        ...defaultErrorOptions,
        ...convertLegacyOptions(messageOrOptions)
      };
    }
    
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    // Get user-friendly message - either from options or from the error
    const userMessage = options.message || errorObj.message;
    
    // Check for duplicate errors
    const fingerprint = options.fingerprint || userMessage;
    if (isErrorDuplicate(fingerprint)) {
      // Skip duplicate error
      return;
    }
    
    // Store error fingerprint to avoid duplicates
    storeErrorFingerprint(fingerprint);
    
    // Log error to console based on level
    if (!options.silent) {
      logErrorToConsole(errorObj, userMessage, options);
    }
    
    // Show toast notification if enabled
    if (options.showToast && !options.suppressToast) {
      showErrorToast(userMessage, options);
    }
    
    // Report to analytics if enabled
    if (options.reportToAnalytics) {
      reportErrorToAnalytics(errorObj, userMessage, options);
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
  error: Error,
  message: string,
  options: Partial<ErrorHandlingOptions>
): void {
  const { level, source, context } = options;
  
  const contextString = context 
    ? `\nContext: ${JSON.stringify(context)}`
    : '';
  
  const logMessage = `[${source || ErrorSource.Unknown}] ${message}${contextString}`;
  
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
  options: Partial<ErrorHandlingOptions>
): void {
  const { level, toastId } = options;
  
  // Determine toast variant based on error level
  let variant: 'default' | 'destructive' = 'default';
  if (level === ErrorLevel.Error || level === ErrorLevel.Critical) {
    variant = 'destructive';
  }
  
  // Show toast with appropriate styling
  toast({
    id: toastId,
    title: options.toastTitle || getToastTitleForErrorLevel(level || ErrorLevel.Error),
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
  error: Error,
  message: string,
  options: Partial<ErrorHandlingOptions>
): void {
  // This is a placeholder for reporting to actual analytics services
  console.log(`[Analytics] Would report: ${message}`);
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
    source: ErrorSource.Component
  });
}

/**
 * Creates a hook-specific error handler
 */
export function createHookErrorHandler(hookName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return createErrorHandler(hookName, { 
    ...defaultOptions, 
    source: ErrorSource.Hook
  });
}

/**
 * Creates a service-specific error handler
 */
export function createServiceErrorHandler(serviceName: string, defaultOptions?: Partial<ErrorHandlingOptions>) {
  return createErrorHandler(serviceName, { 
    ...defaultOptions, 
    source: ErrorSource.Service
  });
}
