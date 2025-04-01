
/**
 * Central error handling system with JSX support
 * 
 * This file provides utilities for handling errors across the application
 * with standardized logging, user feedback, and error categorization.
 */
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { ErrorOptions, errorLevelToToastVariant } from './types';
import { categorizeError } from './categorize';
import { formatErrorForDisplay } from './format';
import { deduplicateError } from './deduplication';

// Default options for error handling
const defaultOptions: Partial<ErrorOptions> = {
  level: 'error',
  source: 'application',
  severity: 'medium',
  technical: false,
  context: {},
  fingerprint: '', // Empty means generate from error
  deduplicate: true,
  silent: false,
  notifyUser: true,
  category: 'general'
};

/**
 * Main error handling function for the application
 * 
 * @param error The error to handle
 * @param userMessage Optional user-friendly message to display
 * @param options Additional options for error handling
 * @returns The error record that was created
 */
export function handleError(
  error: unknown,
  userMessage?: string,
  options?: Partial<ErrorOptions>
) {
  // Merge options with defaults
  const opts = { ...defaultOptions, ...options } as ErrorOptions;
  
  // Convert to standard error if needed
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Generate error fingerprint if not provided
  if (!opts.fingerprint) {
    opts.fingerprint = errorObj.name + ':' + errorObj.message;
  }
  
  // Try to deduplicate the error if enabled
  if (opts.deduplicate) {
    if (deduplicateError(opts.fingerprint)) {
      // This is a duplicate error, don't process it again
      return;
    }
  }
  
  // Categorize the error based on message and stack
  const categorizedError = categorizeError(errorObj, opts);
  
  // Format user-facing message
  const displayMessage = userMessage || formatErrorForDisplay(errorObj, opts);
  
  // Always log to console with appropriate level
  const logContext = { ...opts.context, errorObject: errorObj };
  
  switch (opts.level) {
    case 'debug':
      console.debug(`[DEBUG] ${displayMessage}`, logContext);
      break;
    case 'info':
      console.info(`[INFO] ${displayMessage}`, logContext);
      break;
    case 'warning':
      console.warn(`[WARNING] ${displayMessage}`, logContext);
      break;
    case 'error':
    default:
      console.error(`[ERROR] ${displayMessage}`, errorObj, logContext);
  }
  
  // Show toast notification if enabled and not silent
  if (opts.notifyUser && !opts.silent) {
    toast({
      title: opts.level === 'error' ? 'Error' : 
             opts.level === 'warning' ? 'Warning' : 'Notice',
      description: displayMessage,
      variant: errorLevelToToastVariant[opts.level || 'error']
    });
  }
  
  // Return the error record
  return {
    message: errorObj.message,
    timestamp: new Date(),
    level: opts.level,
    source: opts.source,
    context: opts.context,
    originalError: errorObj,
    fingerprint: opts.fingerprint
  };
}

/**
 * A safe error handler that won't throw additional errors
 * 
 * @param error The error to handle
 * @param userMessage Optional user-friendly message to display
 * @param options Additional options for error handling
 */
export function handleErrorSafe(
  error: unknown,
  userMessage?: string,
  options?: Partial<ErrorOptions>
) {
  try {
    return handleError(error, userMessage, options);
  } catch (handlerError) {
    // Last resort error handling - never throw from here
    console.error('Error in error handler:', handlerError);
    console.error('Original error:', error);
    
    // Try minimal toast as last resort
    try {
      toast({
        title: 'Error',
        description: userMessage || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } catch {
      // Nothing more we can do
    }
  }
}

// Default export for backward compatibility
export default handleError;
