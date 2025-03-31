
/**
 * Error handling utilities
 * 
 * This file contains functions for handling errors in a consistent way
 * throughout the application.
 */

import { ErrorOptions, ErrorLevel, TaggedError } from './types';
import { formatError, getUserFriendlyMessage } from './format';
import { toast } from '@/hooks/use-toast';

// Track shown error messages to prevent duplicates
const shownErrorMessages = new Set<string>();

// Default error options
const defaultErrorOptions: ErrorOptions = {
  level: 'error',
  context: {},
  silent: false,
  technical: false,
  deduplicate: true
};

/**
 * Handle an error with standardized logging and user feedback
 * 
 * @param error The error to handle
 * @param userMessage Optional user-friendly message to display
 * @param options Error handling options
 */
export function handleError(
  error: unknown,
  userMessage?: string,
  options?: Partial<ErrorOptions>
): void {
  // Merge provided options with defaults
  const fullOptions: ErrorOptions = { ...defaultErrorOptions, ...options };
  
  // Format error for consistent handling
  const formattedError = formatError(error);
  
  // Generate unique error key for deduplication
  const errorKey = getErrorKey(formattedError, userMessage);
  
  // Log error with proper level
  logError(formattedError, fullOptions.level, fullOptions.context);
  
  // Show user notification if not silent
  if (!fullOptions.silent) {
    showUserNotification(
      formattedError, 
      userMessage, 
      fullOptions.level, 
      errorKey, 
      fullOptions.deduplicate
    );
  }
}

/**
 * Log an error with appropriate severity level
 */
function logError(
  error: Error, 
  level: ErrorLevel = 'error',
  context?: Record<string, any>
): void {
  const contextString = context ? ` Context: ${JSON.stringify(context)}` : '';
  
  switch (level) {
    case 'debug':
      console.debug(`[DEBUG] ${error.message}${contextString}`, error);
      break;
    case 'info':
      console.info(`[INFO] ${error.message}${contextString}`, error);
      break;
    case 'warning':
      console.warn(`[WARNING] ${error.message}${contextString}`, error);
      break;
    case 'error':
    default:
      console.error(`[ERROR] ${error.message}${contextString}`, error);
      break;
  }
}

/**
 * Show a user notification for the error
 */
function showUserNotification(
  error: Error,
  userMessage?: string,
  level: ErrorLevel = 'error',
  errorKey?: string,
  deduplicate: boolean = true
): void {
  // Use provided message or extract from error
  const message = userMessage || getUserFriendlyMessage(error);
  
  // Skip if this exact error was already shown (deduplication)
  if (deduplicate && errorKey && shownErrorMessages.has(errorKey)) {
    return;
  }
  
  // Map error level to toast variant
  const variant = level === 'error' ? 'destructive' : 
                 level === 'warning' ? 'warning' : 'default';
  
  // Show toast notification
  toast({
    title: level.charAt(0).toUpperCase() + level.slice(1),
    description: message,
    variant: variant as any
  });
  
  // Remember this error was shown
  if (deduplicate && errorKey) {
    shownErrorMessages.add(errorKey);
    
    // Clean up after 30 seconds to prevent memory leaks
    setTimeout(() => {
      shownErrorMessages.delete(errorKey);
    }, 30000);
  }
}

/**
 * Generate a unique key for an error message for deduplication
 */
function getErrorKey(error: Error, userMessage?: string): string {
  return `${error.name}:${error.message}:${userMessage || ''}`;
}

/**
 * Clear all tracked error messages
 * Useful for route changes or testing
 */
export function clearErrorHistory(): void {
  shownErrorMessages.clear();
}
