
/**
 * Error message formatting utilities
 */
import { ErrorLevel, ErrorSource, ErrorHandlingOptions } from './types';

/**
 * Format an error message based on the error object and options
 * 
 * @param error The error to format
 * @param userMessage Optional user-friendly message to override
 * @returns Formatted error message
 */
export function formatErrorMessage(error: unknown, userMessage?: string): string {
  // If a user message is provided, use it
  if (userMessage) {
    return userMessage;
  }
  
  // Handle different error types
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  // Try to stringify objects
  if (error !== null && typeof error === 'object') {
    try {
      return JSON.stringify(error);
    } catch {
      // If stringification fails, fall back to generic message
      return 'An error occurred';
    }
  }
  
  return 'An unknown error occurred';
}

/**
 * Format a technical error message for logging
 * 
 * @param error The error object
 * @param level Error level
 * @param source Error source
 * @param context Additional context
 * @returns Formatted technical error message
 */
export function formatTechnicalError(
  error: Error,
  level: ErrorLevel = ErrorLevel.Error,
  source: ErrorSource = ErrorSource.Unknown,
  context?: Record<string, any>
): string {
  const severity = level === ErrorLevel.Error || level === ErrorLevel.Critical 
    ? 'ERROR' 
    : level.toUpperCase();
  
  const contextString = context 
    ? `\nContext: ${JSON.stringify(context)}`
    : '';
  
  const stack = error.stack 
    ? `\nStack: ${error.stack.split('\n').slice(0, 5).join('\n')}` 
    : '';
  
  return `[${severity}][${source}] ${error.message}${contextString}${stack}`;
}

/**
 * Get a user-friendly error message from an error
 * 
 * @param error The error object
 * @param fallbackMessage Optional fallback message
 * @returns User-friendly error message
 */
export function getUserFriendlyMessage(error: unknown, fallbackMessage?: string): string {
  // For technical errors, provide a simplified message
  if (error instanceof Error) {
    // Some errors have useful messages
    if (error.message.includes('network') || error.message.includes('connection')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    
    if (error.message.includes('timeout') || error.message.includes('timed out')) {
      return 'The operation timed out. Please try again.';
    }
    
    if (error.message.includes('permission') || error.message.includes('access')) {
      return 'You don\'t have permission to perform this action.';
    }
    
    // Return the original message if it seems user-friendly
    if (error.message.length < 100 && !error.message.includes('Error:')) {
      return error.message;
    }
  }
  
  // Return fallback or default message
  return fallbackMessage || 'An unexpected error occurred. Please try again.';
}
