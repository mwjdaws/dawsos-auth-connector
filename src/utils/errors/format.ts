
/**
 * Error formatting utilities
 */
import { ErrorLevel } from './types';

/**
 * Format an error message for display
 * 
 * @param error The error object 
 * @param userMessage Optional user-friendly message
 * @returns Formatted error message string
 */
export function formatErrorMessage(error: unknown, userMessage?: string): string {
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
 * Format a technical error message for logging
 */
export function formatTechnicalError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ''}`;
  }
  
  return String(error);
}

/**
 * Get user-friendly message based on error level
 */
export function getUserFriendlyMessage(level: ErrorLevel): string {
  switch (level) {
    case ErrorLevel.Debug:
      return 'Debug information';
    case ErrorLevel.Info:
      return 'Information';
    case ErrorLevel.Warning:
      return 'Warning';
    case ErrorLevel.Error:
      return 'An error occurred';
    case ErrorLevel.Critical:
      return 'A critical error occurred';
    default:
      return 'An error occurred';
  }
}
