
import { ErrorHandlingOptions } from './errors/types';

/**
 * Centralized error handling function
 * 
 * @param error The error object
 * @param userMessage User-friendly message to display
 * @param options Additional error handling options
 * @returns void
 */
export function handleError(
  error: unknown,
  userMessage?: string,
  options?: ErrorHandlingOptions
): void {
  // Extract error details
  const errorMessage = getErrorMessage(error);
  const errorType = getErrorType(error);
  
  // Prepare context data
  const context = {
    timestamp: new Date().toISOString(),
    errorType,
    errorMessage,
    userMessage: userMessage || errorMessage,
    ...options?.context,
  };
  
  // Log error with context to console
  console.error(`[${context.timestamp}] ${errorType}: ${errorMessage}`, {
    context,
    originalError: error,
  });
  
  // Determine logging level
  const level = options?.level || 'error';
  
  // Handle based on error level
  switch (level) {
    case 'warning':
      console.warn(`Warning: ${userMessage || errorMessage}`, context);
      break;
    case 'info':
      console.info(`Info: ${userMessage || errorMessage}`, context);
      break;
    case 'debug':
      console.debug(`Debug: ${userMessage || errorMessage}`, context);
      break;
    case 'error':
    default:
      // Don't log again if already logged above
      break;
  }
  
  // Additional error reporting or integration could be added here
  // e.g., send to error tracking service, display notification, etc.
}

/**
 * Extracts the error type from an error object
 * 
 * @param error The error object
 * @returns The error type as a string
 */
function getErrorType(error: unknown): string {
  if (error instanceof Error) {
    return error.name;
  }
  
  if (typeof error === 'object' && error !== null) {
    if ('code' in error) {
      return `Error_${String((error as any).code)}`;
    }
    
    if ('type' in error) {
      return String((error as any).type);
    }
  }
  
  return 'UnknownError';
}

/**
 * Extracts a user-friendly message from an error object
 * 
 * @param error The error object
 * @returns A string message describing the error
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  return typeof error === 'string'
    ? error
    : error && typeof error === 'object' && 'message' in error
      ? String((error as any).message)
      : 'Unknown error occurred';
}

// Re-export other error handling utilities for backward compatibility
export * from './errors/types';
export * from './errors/categorize';
export * from './errors/handle';
export * from './errors/wrappers';
