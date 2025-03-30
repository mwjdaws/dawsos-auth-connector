
import { StandardizedError } from './types';

/**
 * Error categorization constants
 */
const ERROR_CODES = {
  UNKNOWN: 'UNKNOWN_ERROR',
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'PERMISSION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  CONFLICT: 'CONFLICT_ERROR',
  FORMAT: 'FORMAT_ERROR',
  API: 'API_ERROR',
  DATABASE: 'DATABASE_ERROR',
};

/**
 * Categorizes and normalizes an unknown error into a standardized error object
 * 
 * Handles various error types including:
 * - Standard Error objects
 * - HTTP response errors
 * - Plain objects with error information
 * - Primitive values
 * 
 * @param error - The unknown error to categorize
 * @returns A standardized error object with consistent properties
 * 
 * @example
 * ```typescript
 * // From a try/catch block
 * try {
 *   // Some operation that might fail
 * } catch (error) {
 *   const standardError = categorizeError(error);
 *   console.error(standardError.message, standardError.code);
 * }
 * ```
 */
export function categorizeError(error: unknown): StandardizedError {
  // Already a standard Error object
  if (error instanceof Error) {
    const standardError = error as StandardizedError;
    
    // Add default code if not present
    if (!standardError.code) {
      standardError.code = ERROR_CODES.UNKNOWN;
    }
    
    return standardError;
  }
  
  // Handle null or undefined
  if (error === null || error === undefined) {
    const standardError = new Error('An unknown error occurred') as StandardizedError;
    standardError.code = ERROR_CODES.UNKNOWN;
    return standardError;
  }
  
  // Handle primitive values (string, number, boolean)
  if (typeof error === 'string' || typeof error === 'number' || typeof error === 'boolean') {
    const message = String(error);
    const standardError = new Error(message) as StandardizedError;
    standardError.code = ERROR_CODES.UNKNOWN;
    standardError.originalError = error;
    return standardError;
  }
  
  // Handle plain objects (like API error responses)
  if (typeof error === 'object') {
    let message = 'An unknown error occurred';
    let code = ERROR_CODES.UNKNOWN;
    let status = undefined;
    
    // Extract message from common error object patterns
    if ('message' in error && typeof error.message === 'string') {
      message = error.message;
    } else if ('error' in error && typeof error.error === 'string') {
      message = error.error;
    } else if ('statusText' in error && typeof error.statusText === 'string') {
      message = error.statusText;
    }
    
    // Extract error code
    if ('code' in error && (typeof error.code === 'string' || typeof error.code === 'number')) {
      code = String(error.code);
    } else if ('status' in error && typeof error.status === 'number') {
      status = error.status;
      // Map HTTP status codes to error codes
      if (status >= 400 && status < 500) {
        if (status === 401) code = ERROR_CODES.AUTHENTICATION;
        else if (status === 403) code = ERROR_CODES.AUTHORIZATION;
        else if (status === 404) code = ERROR_CODES.NOT_FOUND;
        else if (status === 409) code = ERROR_CODES.CONFLICT;
        else if (status === 422) code = ERROR_CODES.VALIDATION;
        else code = ERROR_CODES.API;
      } else if (status >= 500) {
        code = ERROR_CODES.SERVER;
      }
    }
    
    const standardError = new Error(message) as StandardizedError;
    standardError.code = code;
    standardError.status = status;
    standardError.originalError = error;
    return standardError;
  }
  
  // Fallback for any other type
  const standardError = new Error('An unknown error occurred') as StandardizedError;
  standardError.code = ERROR_CODES.UNKNOWN;
  standardError.originalError = error;
  return standardError;
}
