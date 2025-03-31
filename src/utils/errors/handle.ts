
/**
 * Error handling utilities
 * 
 * Centralizes error handling in the application
 */
import { toast } from '@/hooks/use-toast';
import { ErrorLevel, ErrorOptions } from './types';
import { categorizeError } from './categorize';

// In-memory store for deduplication
const recentErrors = new Map<string, { timestamp: number, count: number }>();

// Default timeout for error deduplication (10 seconds)
const DEDUPLICATION_TIMEOUT = 10 * 1000;

// Create a hash for error deduplication
function getErrorHash(error: unknown, context?: Record<string, any>): string {
  const message = error instanceof Error ? error.message : String(error);
  const errorName = error instanceof Error ? error.name : 'UnknownError';
  return `${errorName}:${message}:${JSON.stringify(context || {})}`;
}

/**
 * Central error handler function
 * 
 * @param error The error that occurred
 * @param userMessage User-friendly message to display
 * @param options Additional options for error handling
 */
export function handleError(
  error: unknown,
  userMessage: string,
  options: Partial<ErrorOptions> = {}
): void {
  const {
    level = 'warning',
    technical = false,
    context = {},
    deduplicate = true,
    silent = false
  } = options;

  // Log the error to console based on level
  const consoleMethod = level === 'debug' ? console.debug :
                       level === 'info' ? console.info :
                       level === 'warning' ? console.warn :
                       console.error;

  consoleMethod('[ERROR]', {
    message: userMessage,
    technical,
    error,
    context,
    level
  });

  // Skip notification if silent mode is enabled
  if (silent) {
    return;
  }

  // Deduplicate errors if enabled
  if (deduplicate) {
    const errorHash = options.deduplicationId || getErrorHash(error, context);
    const now = Date.now();
    const existingError = recentErrors.get(errorHash);

    if (existingError) {
      // Check if the error is still within the deduplication window
      if (now - existingError.timestamp < DEDUPLICATION_TIMEOUT) {
        // Increment error count but don't show notification
        recentErrors.set(errorHash, {
          timestamp: now,
          count: existingError.count + 1
        });
        return;
      }
    }

    // Store the new error for deduplication
    recentErrors.set(errorHash, {
      timestamp: now,
      count: 1
    });

    // Clean up old errors (older than deduplication timeout)
    for (const [hash, entry] of recentErrors.entries()) {
      if (now - entry.timestamp > DEDUPLICATION_TIMEOUT) {
        recentErrors.delete(hash);
      }
    }
  }

  // Determine appropriate variant for toast based on error level
  const variant = level === 'info' ? 'default' :
                 level === 'debug' ? 'default' :
                 level === 'warning' ? 'warning' :
                 'destructive';

  // Show toast notification
  toast({
    title: userMessage,
    description: technical && error instanceof Error ? error.message : undefined,
    variant
  });
}

/**
 * Wrapper for handleError that won't throw any exceptions
 * (for use in error boundaries and other sensitive areas)
 */
export function handleErrorSafe(
  error: unknown,
  userMessage: string,
  options: Partial<ErrorOptions> = {}
): void {
  try {
    handleError(error, userMessage, options);
  } catch (handlerError) {
    console.error('[META ERROR] Error in error handler:', handlerError);
    console.error('Original error:', error);
    
    // Attempt to show a toast if possible
    try {
      toast({
        title: 'An unexpected error occurred',
        description: 'The application encountered an error that could not be processed correctly.',
        variant: 'destructive'
      });
    } catch (toastError) {
      // At this point we give up
      console.error('[CRITICAL] Failed to show error toast:', toastError);
    }
  }
}
