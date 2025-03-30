
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateErrorId } from './generateId';
import { ErrorLevel, ErrorHandlingOptions } from './types';
import { categorizeError } from './categorize';
import { formatErrorMessage } from './format';
import { ErrorDeduplication } from './deduplication';

// Set up a deduplication system to prevent duplicate errors
const errorDeduplication = new ErrorDeduplication(60000); // 1 minute default expiry

/**
 * Central error handling function for the application
 * 
 * This function standardizes error handling across the app:
 * - Categorizes errors by type
 * - Prevents duplicate error messages (deduplication)
 * - Formats error messages for human readability 
 * - Shows toast notifications (unless silent mode requested)
 * - Supports retry functionality with custom retry actions
 * - Logs errors with contextual information
 * 
 * @param error The error object
 * @param title Optional custom title for the error
 * @param options Additional options for error handling
 */
export function handleError(
  error: unknown,
  title?: string,
  options?: Partial<ErrorHandlingOptions>
): void {
  // Handle case when error is undefined
  if (!error) {
    console.warn('handleError called with undefined error');
    return;
  }

  // Default options
  const {
    silent = false,
    level = 'error',
    context = {},
    preventDuplicate = true,
  } = options || {};

  // Get error details
  const { message, stack, code, statusCode } = categorizeError(error);
  const errorTitle = title || 'An error occurred';
  
  // Format the error message for display
  const formattedMessage = formatErrorMessage(message);
  
  // Generate a stable error ID for deduplication
  const errorId = generateErrorId(formattedMessage);
  
  // Check for duplicates if enabled
  if (preventDuplicate && errorDeduplication.isDuplicate(errorId)) {
    return;
  }
  
  // Mark this error as seen to prevent duplicates
  errorDeduplication.markAsSeen(errorId);
  
  // Log error to console with context and stack
  console[level === 'debug' ? 'debug' : level === 'info' ? 'info' : level === 'warning' ? 'warn' : 'error'](
    `[${level.toUpperCase()}] ${errorTitle}: ${formattedMessage}`,
    {
      context,
      code,
      statusCode,
      errorId,
      stack 
    }
  );
  
  // Show toast notification if not in silent mode
  if (!silent) {
    // Create a retry action if a retry function is provided
    const retryAction = options?.onRetry ? (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => {
          if (options?.onRetry) options.onRetry();
        }}
      >
        <Repeat className="mr-2 h-4 w-4" />
        Retry
      </Button>
    ) : undefined;
    
    // Show toast with appropriate variant based on error level
    toast({
      title: errorTitle,
      description: formattedMessage,
      variant: level === 'error' ? 'destructive' : level === 'warning' ? 'default' : 'default',
      action: retryAction,
      duration: 5000,
    });
  }
}

/**
 * Helper function to create a retry action for a caught error
 * 
 * @param fn The original function that failed
 * @param errorHandler Function to handle error if retry also fails
 * @returns A function that will retry the operation
 */
export function createRetryAction<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: unknown) => void
): () => Promise<T | undefined> {
  return async () => {
    try {
      return await fn();
    } catch (retryError) {
      if (errorHandler) {
        errorHandler(retryError);
      } else {
        handleError(
          retryError, 
          'Retry Failed', 
          { 
            level: 'error',
            context: { action: 'retry' },
            preventDuplicate: false  // Show retry failures even if similar
          }
        );
      }
      return undefined;
    }
  };
}
