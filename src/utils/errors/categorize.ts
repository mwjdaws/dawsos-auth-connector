
import { BaseError, ValidationError, ApiError, DatabaseError, AuthError } from './types';

/**
 * Categorizes errors into specific types based on their properties or message content
 * 
 * @param error The error to categorize
 * @returns The categorized error
 */
export function categorizeError(error: unknown): Error {
  // If it's already one of our custom error types, return it as is
  if (
    error instanceof ValidationError ||
    error instanceof ApiError ||
    error instanceof DatabaseError ||
    error instanceof AuthError ||
    error instanceof BaseError
  ) {
    return error;
  }
  
  // If it's a standard Error, check its message to categorize
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('validation') || message.includes('invalid')) {
      return new ValidationError(error.message);
    }
    
    if (message.includes('api') || message.includes('fetch') || message.includes('http')) {
      return new ApiError(error.message);
    }
    
    if (message.includes('database') || message.includes('db') || 
        message.includes('query') || message.includes('sql')) {
      return new DatabaseError(error.message);
    }
    
    if (message.includes('auth') || message.includes('login') || 
        message.includes('permission') || message.includes('unauthorized')) {
      return new AuthError(error.message);
    }
    
    return error;
  }
  
  // For non-Error objects, convert to string and create a generic error
  const errorMessage = typeof error === 'string' 
    ? error 
    : error && typeof error === 'object' && 'message' in error
      ? String((error as any).message)
      : 'Unknown error occurred';
      
  return new Error(errorMessage);
}
