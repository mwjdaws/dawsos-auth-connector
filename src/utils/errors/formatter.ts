
import { ErrorLevel, ErrorSource } from './types';

/**
 * Format an error for logging with consistent structure and context
 * 
 * @param error The error that occurred
 * @param options Formatting options
 * @returns A structured representation of the error for logging
 */
export function formatErrorForLogging(
  error: Error | unknown,
  options?: {
    level?: ErrorLevel;
    source?: ErrorSource;
    context?: Record<string, any>;
    fingerprint?: string;
  }
): any {
  const formattedError: Record<string, any> = {
    timestamp: new Date().toISOString(),
    level: options?.level || ErrorLevel.Error,
    source: options?.source || ErrorSource.Unknown,
  };
  
  if (error instanceof Error) {
    formattedError.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
    
    // Add additional properties if it's a custom error
    Object.entries(error).forEach(([key, value]) => {
      if (!['name', 'message', 'stack'].includes(key)) {
        formattedError.error[key] = value;
      }
    });
  } else if (typeof error === 'string') {
    formattedError.error = { message: error };
  } else {
    // For unknown error types, try to safely stringify
    try {
      formattedError.error = { raw: JSON.stringify(error) };
    } catch {
      formattedError.error = { raw: String(error) };
    }
  }
  
  // Add fingerprint if available
  if (options?.fingerprint) {
    formattedError.fingerprint = options.fingerprint;
  }
  
  // Add context if available
  if (options?.context) {
    formattedError.context = options.context;
  }
  
  return formattedError;
}

/**
 * Format an error for user display with clear, concise messaging
 * 
 * @param error The error that occurred
 * @param customMessage A custom message to display
 * @param duplicateCount Number of times this error has been seen
 * @returns A user-friendly error message
 */
export function formatErrorForUser(
  error: Error | unknown,
  customMessage?: string,
  duplicateCount = 0
): string {
  // If a custom message is provided, use it
  if (customMessage) {
    return addDuplicateInfo(customMessage, duplicateCount);
  }
  
  // Extract message from Error object
  if (error instanceof Error) {
    // Get error message or use a generic one
    const errorMessage = error.message || 'An unexpected error occurred';
    return addDuplicateInfo(errorMessage, duplicateCount);
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return addDuplicateInfo(error, duplicateCount);
  }
  
  // Default generic message for unknown error types
  return addDuplicateInfo('An unexpected error occurred', duplicateCount);
}

/**
 * Add duplicate count information to an error message if needed
 * 
 * @param message The base error message
 * @param duplicateCount Number of times this error has been seen
 * @returns Error message with duplicate information if applicable
 */
function addDuplicateInfo(message: string, duplicateCount: number): string {
  if (duplicateCount <= 1) {
    return message;
  }
  
  return `${message} (occurred ${duplicateCount} times)`;
}
