
import { ErrorCategory } from './types';
import { ApiError, ValidationError } from './types';

/**
 * Categorizes an error based on its properties or message content
 */
export function categorizeError(error: unknown): ErrorCategory {
  if (!error) return ErrorCategory.UNKNOWN;
  
  // For ApiError instances
  if (error instanceof ApiError) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      return ErrorCategory.AUTHENTICATION;
    }
    if (error.statusCode === 400) {
      return ErrorCategory.VALIDATION;
    }
    if (error.statusCode === 404) {
      return ErrorCategory.API;
    }
    if (error.statusCode >= 500) {
      return ErrorCategory.SERVER;
    }
    return ErrorCategory.API;
  }
  
  // For ValidationError instances
  if (error instanceof ValidationError) {
    return ErrorCategory.VALIDATION;
  }
  
  // For generic Error instances
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Authentication errors
    if (message.includes('auth') || 
        message.includes('login') || 
        message.includes('unauthorized') || 
        message.includes('unauthenticated') || 
        message.includes('permission') ||
        message.includes('forbidden')) {
      return ErrorCategory.AUTHENTICATION;
    }
    
    // Network errors
    if (message.includes('network') || 
        message.includes('connect') || 
        message.includes('offline') ||
        message.includes('cors')) {
      return ErrorCategory.NETWORK;
    }
    
    // Timeout errors
    if (message.includes('timeout') || 
        message.includes('timed out') || 
        error.name === 'AbortError') {
      return ErrorCategory.TIMEOUT;
    }
    
    // Validation errors
    if (message.includes('validation') || 
        message.includes('invalid') || 
        message.includes('required') ||
        message.includes('must be')) {
      return ErrorCategory.VALIDATION;
    }
    
    // Database errors
    if (message.includes('database') || 
        message.includes('db') || 
        message.includes('query') ||
        message.includes('sql')) {
      return ErrorCategory.DATABASE;
    }
  }
  
  // For Supabase error objects
  if (typeof error === 'object' && error !== null) {
    if ('code' in error) {
      const code = String(error.code);
      
      // Supabase PostgreSQL error codes
      if (code.startsWith('22') || code.startsWith('23')) {
        return ErrorCategory.DATABASE;
      }
      
      // Authentication error codes
      if (code === '401' || code === '403') {
        return ErrorCategory.AUTHENTICATION;
      }
    }
  }
  
  return ErrorCategory.UNKNOWN;
}
