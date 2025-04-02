
/**
 * Error categorization utilities
 */
import { ErrorSource } from './types';

/**
 * Categorize an error based on its type and properties
 */
export function categorizeError(error: unknown): ErrorSource {
  // Handle fetch and network errors
  if (isNetworkError(error)) {
    return ErrorSource.Network;
  }
  
  // Handle database/Supabase errors
  if (isDatabaseError(error)) {
    return ErrorSource.Database;
  }
  
  // Handle validation errors
  if (isValidationError(error)) {
    return ErrorSource.Validation;
  }
  
  // Default to unknown source
  return ErrorSource.Unknown;
}

/**
 * Check if an error is a network error
 */
function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  
  // Check for fetch API error
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }
  
  // Check for network failure
  if (
    error instanceof Error && (
      error.message.includes('network') ||
      error.message.includes('internet') ||
      error.message.includes('offline') ||
      error.message.includes('CORS') ||
      error.message.includes('certificate')
    )
  ) {
    return true;
  }
  
  return false;
}

/**
 * Check if an error is a database error
 */
function isDatabaseError(error: unknown): boolean {
  if (!error) return false;
  
  // Check for common database error patterns
  if (
    error instanceof Error && (
      error.message.includes('database') ||
      error.message.includes('query') ||
      error.message.includes('SQL') ||
      error.message.includes('constraint') ||
      error.message.includes('foreign key') ||
      error.message.includes('unique violation')
    )
  ) {
    return true;
  }
  
  // Handle Supabase errors
  const anyError = error as any;
  if (anyError && (
    anyError.code?.toString().startsWith('PGRST') || 
    anyError.hint?.includes('SQL') ||
    anyError.details?.includes('query')
  )) {
    return true;
  }
  
  return false;
}

/**
 * Check if an error is a validation error
 */
function isValidationError(error: unknown): boolean {
  if (!error) return false;
  
  // Check for common validation error patterns
  if (
    error instanceof Error && (
      error.message.includes('validation') ||
      error.message.includes('required') ||
      error.message.includes('invalid') ||
      error.message.includes('must be') ||
      error.message.includes('expected') ||
      error.message.includes('schema')
    )
  ) {
    return true;
  }
  
  return false;
}
