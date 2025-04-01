
// Importing required modules
import { toast } from "@/hooks/use-toast";
import { ErrorHandlingOptions, ErrorLevel, ErrorSeverity, ErrorSource, EnhancedError } from "./types";
import { categorizeError } from "./categorize";

// Default error handling options
const defaultOptions: ErrorHandlingOptions = {
  level: 'error',
  context: {},
  silent: false,
  reportToAnalytics: true,
  showToast: true,
  toastTitle: undefined
};

/**
 * Internal function to determine error level text for logging
 */
function getErrorLevelText(level?: ErrorSeverity | ErrorLevel): string {
  if (!level) return 'ERROR';
  
  // Convert ErrorLevel enum values to strings
  if (typeof level === 'string') {
    // Handle string-based level values
    switch (level.toUpperCase()) {
      case 'DEBUG': return 'DEBUG';
      case 'INFO': return 'INFO';
      case 'WARNING': return 'WARNING';
      default: return 'ERROR';
    }
  }
  
  // Use the enum value directly
  return level;
}

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
  options?: Partial<ErrorHandlingOptions>
): void {
  // Combine options with defaults
  const opts = { ...defaultOptions, ...options };
  
  // Make sure we have an Error object to work with
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Add enhanced properties if they don't exist
  const enhancedError = errorObj as EnhancedError;
  if (!enhancedError.source) {
    enhancedError.source = categorizeError(errorObj).source;
  }
  
  // Determine error level text for logging
  const levelText = getErrorLevelText(opts.level);
  
  // Default user message if none provided
  const displayMessage = userMessage || errorObj.message;
  
  // Always log to console with appropriate level
  switch (levelText) {
    case 'DEBUG':
      console.debug(`[DEBUG] ${displayMessage}`, errorObj, opts.context);
      break;
    case 'INFO':
      console.info(`[INFO] ${displayMessage}`, errorObj, opts.context);
      break;
    case 'WARNING':
      console.warn(`[WARNING] ${displayMessage}`, errorObj, opts.context);
      break;
    case 'ERROR':
    default:
      console.error(`[ERROR] ${displayMessage}`, errorObj, opts.context);
  }
  
  // Show toast notification if enabled
  if (opts.showToast && !opts.silent) {
    toast({
      id: opts.toastId,
      title: opts.toastTitle || getLevelTitle(levelText),
      description: displayMessage,
      variant: getVariantFromLevel(levelText),
    });
  }
}

/**
 * Get toast title based on error level
 */
function getLevelTitle(level: string): string {
  switch (level) {
    case 'DEBUG': return 'Debug Info';
    case 'INFO': return 'Information';
    case 'WARNING': return 'Warning';
    default: return 'Error';
  }
}

/**
 * Get toast variant based on error level
 */
function getVariantFromLevel(level: string): 'default' | 'destructive' {
  switch (level) {
    case 'ERROR': return 'destructive';
    default: return 'default';
  }
}

/**
 * Creates an error handler function with predefined context
 * 
 * @param componentName The name of the component or module
 * @param defaultOptions Default options for all errors handled by this function
 * @returns An error handler function with predefined context
 */
export function createComponentErrorHandler(
  componentName: string,
  defaultOptions?: Partial<ErrorHandlingOptions>
) {
  return (error: unknown, userMessage?: string, options?: Partial<ErrorHandlingOptions>): void => {
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
 * Creates an error handler function for hooks
 */
export const createHookErrorHandler = createComponentErrorHandler;

/**
 * Creates an error handler function for services
 */
export const createServiceErrorHandler = createComponentErrorHandler;
