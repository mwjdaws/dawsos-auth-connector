
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
    /cors/i,
    /^\d{3}$/  // HTTP status codes
  ],
  server: [
    /server/i,
    /500/i,
    /503/i,
    /unavailable/i,
    /internal server error/i
  ],
  database: [
    /database/i,
    /sql/i,
    /query/i,
    /constraint/i,
    /transaction/i,
    /supabase/i,
    /foreign key/i
  ],
  auth: [
    /auth/i,
    /unauthorized/i,
    /forbidden/i,
    /permission/i,
    /login/i,
    /token/i,
    /401/i,
    /403/i
  ],
  validation: [
    /validation/i,
    /invalid/i,
    /required/i,
    /must be/i,
    /cannot be/i,
    /too (long|short|small|large)/i,
    /bad format/i,
    /not found/i,
    /doesn't exist/i
  ],
  user: [
    /user canceled/i,
    /user aborted/i,
    /user rejected/i,
    /user denied/i,
    /permission denied/i
  ]
};

/**
 * Categorize an error based on its message and stack
 * 
 * @param error The error to categorize
 * @param options Options to influence categorization
 * @returns The categorized error with source property
 */
export function categorizeError(error: Error, options?: Partial<ErrorHandlingOptions>): Error & { source: ErrorSource } {
  // If source is explicitly provided in options, use it
  if (options?.source) {
    return { ...error, source: options.source };
  }
  
  const errorString = `${error.message} ${error.stack || ''}`.toLowerCase();
  
  // Try to match error patterns to determine source
  if (errorPatterns.network.some(pattern => pattern.test(errorString))) {
    return { ...error, source: 'network' };
  }
  
  if (errorPatterns.server.some(pattern => pattern.test(errorString))) {
    return { ...error, source: 'server' };
  }
  
  if (errorPatterns.database.some(pattern => pattern.test(errorString))) {
    return { ...error, source: 'database' };
  }
  
  if (errorPatterns.auth.some(pattern => pattern.test(errorString))) {
    return { ...error, source: 'user' };
  }
  
  if (errorPatterns.validation.some(pattern => pattern.test(errorString))) {
    return { ...error, source: 'application' };
  }
  
  if (errorPatterns.user.some(pattern => pattern.test(errorString))) {
    return { ...error, source: 'user' };
  }
  
  // Default to unknown source
  return { ...error, source: 'unknown' };
}

/**
 * Get a user-friendly explanation based on error category
 * 
 * @param error The categorized error
 * @returns A user-friendly explanation
 */
export function getErrorExplanation(error: Error & { source: ErrorSource }): string {
  switch (error.source) {
    case 'network':
      return 'There was a problem connecting to the server. Please check your internet connection and try again.';
    case 'server':
      return 'The server encountered an error while processing your request. Please try again later.';
    case 'database':
      return 'There was a problem accessing the required data. Please try again later.';
    case 'user':
      return 'The action could not be completed due to an authentication or permission issue.';
    case 'application':
      return 'The application encountered an unexpected error. Please try again.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
}
