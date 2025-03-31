
/**
 * Error categorization utilities
 * 
 * Functions for identifying and categorizing errors.
 */

/**
 * Check if an error is a network error
 * 
 * @param error The error to check
 * @returns True if the error is likely a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  
  // Check for common network error messages
  const errorMessage = error instanceof Error 
    ? error.message.toLowerCase() 
    : String(error).toLowerCase();
  
  return (
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('offline') ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('cors') ||
    (error instanceof TypeError && errorMessage.includes('fetch'))
  );
}

/**
 * Check if an error is an authentication error
 * 
 * @param error The error to check
 * @returns True if the error is likely an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (!error) return false;
  
  // Check for common auth error patterns
  const errorMessage = error instanceof Error 
    ? error.message.toLowerCase() 
    : String(error).toLowerCase();
  
  const statusCode = (error as any)?.status || (error as any)?.statusCode;
  
  return (
    statusCode === 401 ||
    statusCode === 403 ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('forbidden') ||
    errorMessage.includes('authentication') ||
    errorMessage.includes('not logged in') ||
    errorMessage.includes('permission denied') ||
    errorMessage.includes('invalid token') ||
    errorMessage.includes('token expired')
  );
}

/**
 * Categorize an error into common types
 * 
 * @param error The error to categorize
 * @returns The error category
 */
export function categorizeError(error: unknown): 'network' | 'auth' | 'validation' | 'database' | 'unknown' {
  if (isNetworkError(error)) {
    return 'network';
  }
  
  if (isAuthError(error)) {
    return 'auth';
  }
  
  const errorMessage = error instanceof Error 
    ? error.message.toLowerCase() 
    : String(error).toLowerCase();
  
  if (
    errorMessage.includes('validation') ||
    errorMessage.includes('invalid') ||
    errorMessage.includes('required field')
  ) {
    return 'validation';
  }
  
  if (
    errorMessage.includes('database') ||
    errorMessage.includes('sql') ||
    errorMessage.includes('query') ||
    errorMessage.includes('constraint')
  ) {
    return 'database';
  }
  
  return 'unknown';
}
