
import { ErrorCategory } from './types';

/**
 * Categorizes an error into a standard error category based on its properties
 * @param error The error to categorize
 * @returns The appropriate error category
 */
export function categorizeError(error: unknown): ErrorCategory {
  // If it's our custom error classes
  if (error instanceof Error) {
    // Check for custom error types by their name property
    switch (error.name) {
      case 'AuthError':
        return ErrorCategory.AUTHENTICATION;
      case 'ValidationError':
        return ErrorCategory.VALIDATION;
      case 'ApiError':
        return ErrorCategory.API;
      case 'NetworkError':
        return ErrorCategory.NETWORK;
      case 'DatabaseError':
        return ErrorCategory.DATABASE;
    }
    
    // Try to categorize based on message content if no specific type
    const message = error.message.toLowerCase();
    if (message.includes('auth') || message.includes('login') || message.includes('permission')) {
      return ErrorCategory.AUTHENTICATION;
    }
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return ErrorCategory.VALIDATION;
    }
    if (message.includes('network') || message.includes('connection') || message.includes('offline')) {
      return ErrorCategory.NETWORK;
    }
    if (message.includes('timeout') || message.includes('timed out')) {
      return ErrorCategory.TIMEOUT;
    }
    if (message.includes('permission') || message.includes('forbidden') || message.includes('denied')) {
      return ErrorCategory.PERMISSION;
    }
  }
  
  // If it's an object with status code
  if (error && typeof error === 'object') {
    // Check for HTTP status codes
    if ('status' in error || 'statusCode' in error) {
      const status = (error as any).status || (error as any).statusCode;
      
      if (status >= 400 && status < 500) {
        if (status === 401 || status === 403) {
          return ErrorCategory.PERMISSION;
        }
        if (status === 404) {
          return ErrorCategory.OPERATION;
        }
        if (status === 422) {
          return ErrorCategory.VALIDATION;
        }
        return ErrorCategory.API;
      }
      
      if (status >= 500) {
        return ErrorCategory.SERVER;
      }
    }
    
    // Check for database error codes
    if ('code' in error) {
      const code = String((error as any).code);
      
      // PostgreSQL error codes
      if (code.match(/^[0-9]{5}$/)) {
        if (code.startsWith('23')) {
          return ErrorCategory.VALIDATION;
        }
        if (code.startsWith('28')) {
          return ErrorCategory.PERMISSION;
        }
        if (code.startsWith('42')) {
          return ErrorCategory.DATABASE;
        }
      }
    }
  }
  
  // Default case
  return ErrorCategory.UNKNOWN;
}
