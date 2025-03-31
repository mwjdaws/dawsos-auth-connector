
/**
 * Error handling utilities
 */
import { toast } from '@/hooks/use-toast';
import { deduplicateError } from './deduplication';
import { categorizeError } from './categorize';
import { ErrorLevel, ErrorContext, ErrorOptions } from './types';
import { formatError } from './format';

/**
 * Main error handler for the application
 * 
 * Handles error logging, notification, and tracking
 */
export const handleError = (
  error: unknown,
  friendlyMessage?: string,
  options?: ErrorOptions
): void => {
  const { 
    level = "error", 
    context = {}, 
    silent = false,
    technical = false,
    deduplicate = true
  } = options || {};
  
  // Format the error for consistent handling
  const formattedError = formatError(error);
  
  // Log errors to console
  logError(formattedError, level, context);
  
  // Show user notification unless silent
  if (!silent) {
    notifyUser(formattedError, friendlyMessage, level, deduplicate);
  }
  
  // Additional handling for technical errors
  if (technical) {
    console.error('[TECHNICAL ERROR]', formattedError, context);
  }
}

/**
 * Safe error handler that won't throw
 */
export const handleErrorSafe = (
  error: unknown,
  friendlyMessage?: string,
  options?: ErrorOptions
): void => {
  try {
    handleError(error, friendlyMessage, options);
  } catch (handlerError) {
    console.error('Error in error handler:', handlerError);
    
    // Last resort error notification
    try {
      toast({
        title: 'Unexpected Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    } catch {
      // Nothing more we can do
    }
  }
}

/**
 * Log error to console with appropriate level
 */
function logError(
  error: Error | string,
  level: ErrorLevel,
  context: ErrorContext
): void {
  const message = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : undefined;
  
  switch (level) {
    case 'debug':
      console.debug(`[DEBUG] ${message}`, { context, stack });
      break;
    case 'info':
      console.info(`[INFO] ${message}`, { context, stack });
      break;
    case 'warning':
      console.warn(`[WARNING] ${message}`, { context, stack });
      break;
    case 'error':
    default:
      console.error(`[ERROR] ${message}`, { context, stack });
      break;
  }
}

/**
 * Show error notification to user
 */
function notifyUser(
  error: Error | string,
  friendlyMessage?: string,
  level: ErrorLevel = 'error',
  deduplicate = true
): void {
  const errorMessage = error instanceof Error ? error.message : error;
  const message = friendlyMessage || errorMessage;
  
  // Skip notification if we should deduplicate and it's a duplicate
  if (deduplicate && deduplicateError(message)) {
    console.log('Skipping duplicate error notification:', message);
    return;
  }
  
  const variant = level === 'error' ? 'destructive' : 
                 level === 'warning' ? 'warning' : 'default';
  
  toast({
    title: level === 'error' ? 'Error' : 
          level === 'warning' ? 'Warning' : 'Notice',
    description: message,
    variant,
  });
}
