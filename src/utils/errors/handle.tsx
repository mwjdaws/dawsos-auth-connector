
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast as showToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { categorizeError, getErrorMessage } from './categorize';
import { ErrorLevel, StandardizedError } from './types';
import { ErrorHandlingCompatOptions } from '@/utils/compatibility';

// Global error tracking to prevent duplicates
const recentErrors = new Map<string, number>();

// Error deduplication window (in milliseconds)
const DEDUPLICATION_WINDOW = 5000;

// Clean up old error entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of recentErrors.entries()) {
    if (now - timestamp > DEDUPLICATION_WINDOW) {
      recentErrors.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Handle errors in a standardized way throughout the application
 * @param error The error object to handle
 * @param userMessage Optional user-friendly message to show
 * @param options Additional options for error handling
 */
export function handleError(
  error: unknown,
  userMessage?: string,
  options: ErrorHandlingCompatOptions = {}
): StandardizedError {
  // Process the error
  const standardizedError = categorizeError(error);
  const errorId = uuidv4();
  
  // Get the error message
  const message = userMessage || getErrorMessage(standardizedError);
  const errorLevel = options.level as ErrorLevel || standardizedError.level || 'error';
  
  // Default values for options
  const {
    context = {},
    silent = false,
    technical = false,
    title = 'An error occurred',
    actionLabel,
    onRetry,
    preventDuplicate = false,
    duration = 5000,
    deduplicate = false
  } = options;

  // Generate a deduplication key if needed
  const deduplicationKey = deduplicate ? 
    `${standardizedError.name || 'Error'}-${message}` : errorId;
  
  // Check for duplicate errors
  if (deduplicate && recentErrors.has(deduplicationKey)) {
    console.log(`Duplicate error suppressed: ${message}`);
    return { ...standardizedError, id: errorId, handled: true };
  }
  
  // Record this error to prevent duplicates
  if (deduplicate) {
    recentErrors.set(deduplicationKey, Date.now());
  }

  // Always log the error to the console for debugging
  if (errorLevel === 'debug') {
    console.debug(`[DEBUG ERROR] ${message}`, standardizedError, context);
  } else if (errorLevel === 'info') {
    console.info(`[INFO ERROR] ${message}`, standardizedError, context);
  } else if (errorLevel === 'warning') {
    console.warn(`[WARNING] ${message}`, standardizedError, context);
  } else {
    console.error(`[ERROR] ${message}`, standardizedError, context);
  }

  // Display a toast notification unless silent is true
  if (!silent) {
    const toastVariant = errorLevel === 'error' ? 'destructive' : 
                         errorLevel === 'warning' ? 'warning' : 'default';
    
    // Create the retry action if a retry handler is provided
    const action = onRetry && actionLabel ? (
      <ToastAction altText={actionLabel} onClick={onRetry}>
        {actionLabel}
      </ToastAction>
    ) : undefined;
    
    // Show the toast
    showToast({
      title,
      description: technical ? `${message} (${standardizedError.name})` : message,
      variant: toastVariant as any,
      action,
      duration
    });
  }

  // Return the standardized error with additional handling info
  return {
    ...standardizedError,
    id: errorId,
    handled: true
  };
}

/**
 * Safe version of handleError that doesn't require JSX
 */
export function handleErrorSafe(
  error: unknown,
  userMessage?: string,
  options?: ErrorHandlingCompatOptions
): StandardizedError {
  try {
    // Use the regular handler if possible
    return handleError(error, userMessage, options);
  } catch (e) {
    // Fallback error handling (no UI)
    console.error('Error handling error:', error);
    console.error('User message:', userMessage);
    console.error('Options:', options);
    
    const standardizedError = categorizeError(error);
    return {
      ...standardizedError,
      id: 'fallback-' + Math.random().toString(36).substring(2, 9),
      handled: true
    };
  }
}
