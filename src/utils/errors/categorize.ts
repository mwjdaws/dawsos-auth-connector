
/**
 * Error categorization utilities
 */
import { ErrorHandlingOptions, ErrorSource } from './types';

// Common error patterns for different sources
const errorPatterns = {
  network: [
    /network/i,
    /offline/i,
    /failed to fetch/i,
    /request timed out/i,
    /cors/i
  ],
  database: [
    /database/i,
    /sql/i,
    /query/i,
    /constraint/i,
    /supabase/i
  ],
  authentication: [
    /auth/i,
    /unauthorized/i,
    /forbidden/i,
    /permission/i,
    /login/i,
    /token/i
  ],
  validation: [
    /validation/i,
    /invalid/i,
    /required/i,
    /must be/i,
    /cannot be/i
  ]
};

/**
 * Categorize an error based on its message and details
 * 
 * @param error The error to categorize
 * @param options Additional categorization options
 * @returns The source category for the error
 */
export function categorizeError(
  error: Error, 
  options?: Partial<ErrorHandlingOptions>
): ErrorSource {
  // If source is explicitly provided in options, use it
  if (options?.source) {
    return options.source as ErrorSource;
  }
  
  const errorString = `${error.message} ${error.stack || ''}`.toLowerCase();
  
  // Try to match error patterns
  if (errorPatterns.network.some(pattern => pattern.test(errorString))) {
    return ErrorSource.NETWORK;
  }
  
  if (errorPatterns.database.some(pattern => pattern.test(errorString))) {
    return ErrorSource.DATABASE;
  }
  
  if (errorPatterns.authentication.some(pattern => pattern.test(errorString))) {
    return ErrorSource.AUTHENTICATION;
  }
  
  if (errorPatterns.validation.some(pattern => pattern.test(errorString))) {
    return ErrorSource.VALIDATION;
  }
  
  // Default to unknown source
  return ErrorSource.UNKNOWN;
}

/**
 * Get a user-friendly message based on error category
 * 
 * @param source The error source category
 * @returns A user-friendly message
 */
export function getUserMessageForErrorSource(source: ErrorSource): string {
  switch (source) {
    case ErrorSource.NETWORK:
      return 'A network error occurred. Please check your connection and try again.';
    case ErrorSource.DATABASE:
      return 'A database error occurred. Please try again later.';
    case ErrorSource.AUTHENTICATION:
      return 'An authentication error occurred. Please log in again.';
    case ErrorSource.VALIDATION:
      return 'The provided data is invalid. Please check your inputs and try again.';
    case ErrorSource.UI:
      return 'An error occurred in the user interface. Please try again.';
    case ErrorSource.API:
      return 'An API error occurred. Please try again later.';
    default:
      return 'An unknown error occurred. Please try again later.';
  }
}
