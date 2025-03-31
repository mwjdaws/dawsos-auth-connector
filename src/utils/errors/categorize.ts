
/**
 * Error categorization utilities
 * 
 * Functions for categorizing errors by type and source.
 */
import { TaggedError } from './types';

// Error type constants
export const ERROR_TYPES = {
  NETWORK: 'network',
  DATABASE: 'database',
  AUTH: 'auth',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  TIMEOUT: 'timeout',
  API: 'api',
  UNKNOWN: 'unknown'
};

/**
 * Categorize an error by analyzing its properties and message
 * 
 * @param error The error to categorize
 * @returns The categorized error with an errorType property
 */
export function categorizeError(error: unknown): TaggedError {
  // If already categorized, return as is
  if (error instanceof Error && (error as TaggedError).errorType) {
    return error as TaggedError;
  }
  
  const err = error instanceof Error ? error : new Error(String(error));
  const taggedError = err as TaggedError;
  
  // Check for network errors
  if (
    !navigator.onLine || 
    err.message.includes('network') ||
    err.message.includes('Network') ||
    err.message.includes('fetch') ||
    err.message.includes('Failed to fetch')
  ) {
    taggedError.errorType = ERROR_TYPES.NETWORK;
    return taggedError;
  }
  
  // Check for database errors
  if (
    err.message.includes('database') ||
    err.message.includes('Database') ||
    err.message.includes('DB') ||
    err.message.includes('SQL') ||
    err.message.includes('query')
  ) {
    taggedError.errorType = ERROR_TYPES.DATABASE;
    return taggedError;
  }
  
  // Check for authentication errors
  if (
    err.message.includes('auth') ||
    err.message.includes('Auth') ||
    err.message.includes('token') ||
    err.message.includes('credentials') ||
    err.message.includes('permission') ||
    err.message.includes('unauthorized') ||
    err.message.includes('not authorized') ||
    err.message.includes('login') ||
    err.message.toLowerCase().includes('access denied')
  ) {
    taggedError.errorType = ERROR_TYPES.AUTH;
    return taggedError;
  }
  
  // Check for validation errors
  if (
    err.message.includes('validation') ||
    err.message.includes('invalid') ||
    err.message.includes('not valid') ||
    err.message.includes('schema') ||
    err.message.includes('required field')
  ) {
    taggedError.errorType = ERROR_TYPES.VALIDATION;
    return taggedError;
  }
  
  // Check for not found errors
  if (
    err.message.includes('not found') ||
    err.message.includes('404') ||
    err.message.includes('does not exist')
  ) {
    taggedError.errorType = ERROR_TYPES.NOT_FOUND;
    return taggedError;
  }
  
  // Default to unknown
  taggedError.errorType = ERROR_TYPES.UNKNOWN;
  return taggedError;
}
