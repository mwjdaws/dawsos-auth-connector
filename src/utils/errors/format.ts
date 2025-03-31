
/**
 * Error formatting utilities
 * 
 * Provides utilities for formatting errors for display to users
 * based on error type and context.
 */
import { ErrorHandlingOptions } from './types';

/**
 * Format an error for display to the user
 * 
 * @param error The error to format
 * @param options Options that influence formatting
 * @returns A user-friendly error message
 */
export function formatErrorForDisplay(error: Error, options?: Partial<ErrorHandlingOptions>): string {
  // For technical users, we can provide more details
  if (options?.technical) {
    return `${error.name}: ${error.message}`;
  }
  
  // For regular users, try to provide a friendly message
  if (error.message.includes('permission denied') || error.message.includes('unauthorized')) {
    return 'You don\'t have permission to perform this action. Please try logging in again.';
  }
  
  if (error.message.includes('not found') || error.message.includes('does not exist')) {
    return 'The requested resource could not be found. It may have been moved or deleted.';
  }
  
  if (error.message.includes('timeout') || error.message.includes('timed out')) {
    return 'The operation took too long to complete. Please try again.';
  }
  
  if (error.message.includes('network') || error.message.includes('offline')) {
    return 'There was a problem with your internet connection. Please check your connection and try again.';
  }
  
  if (error.message.includes('validation') || error.message.includes('invalid')) {
    return 'Some of the information provided is not valid. Please check your input and try again.';
  }
  
  // Default friendly message
  return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Format error for reporting to analytics or logging systems
 * 
 * @param error The error to format
 * @param options Options that influence formatting
 * @returns A structured error report
 */
export function formatErrorForReporting(error: Error, options?: Partial<ErrorHandlingOptions>) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    level: options?.level || 'error',
    source: options?.source || 'unknown',
    context: options?.context || {},
    fingerprint: options?.fingerprint || ''
  };
}
