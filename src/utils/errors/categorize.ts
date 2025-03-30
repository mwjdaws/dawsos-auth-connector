import { StandardizedError, ApiError, ValidationError, ErrorLevel } from './types';

/**
 * Categorizes errors into standardized formats
 * @param error The original error
 * @returns A standardized error object
 */
export function categorizeError(error: unknown): StandardizedError {
  // If it's already a StandardizedError, return it
  if (isStandardizedError(error)) {
    return error;
  }

  // Check if it's an instance of Error
  if (error instanceof Error) {
    const standardizedError: StandardizedError = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      originalError: error,
      timestamp: Date.now()
    };

    // Special handling for different error types
    if (error.name === 'TypeError') {
      standardizedError.level = 'error';
      standardizedError.technical = true;
    } else if (error.name === 'SyntaxError') {
      standardizedError.level = 'error';
      standardizedError.technical = true;
    } else if (error.name === 'ReferenceError') {
      standardizedError.level = 'error';
      standardizedError.technical = true;
    } else if (error.name.includes('Network')) {
      standardizedError.level = 'warning';
      standardizedError.userMessage = 'Network connection issue';
    }

    return standardizedError;
  }

  // Handle non-Error objects thrown as errors
  if (error !== null && typeof error === 'object') {
    const objError = error as Record<string, any>;
    
    // Check if it looks like a structured API error
    if ('status' in objError || 'statusCode' in objError) {
      const apiError: ApiError = {
        name: objError.name || 'ApiError',
        message: objError.message || 'API error occurred',
        statusCode: objError.statusCode || objError.status,
        originalError: error,
        timestamp: Date.now(),
        level: 'error'
      };

      // Categorize by HTTP status code
      if (apiError.statusCode) {
        if (apiError.statusCode >= 400 && apiError.statusCode < 500) {
          apiError.level = 'warning';
        } else if (apiError.statusCode >= 500) {
          apiError.level = 'error';
        }
      }

      return apiError;
    }
    
    // Handle validation-like errors
    if ('errors' in objError || 'constraints' in objError || 'field' in objError) {
      const validationError: ValidationError = {
        name: objError.name || 'ValidationError',
        message: objError.message || 'Validation error occurred',
        field: objError.field || objError.property,
        constraints: objError.constraints || objError.errors,
        originalError: error,
        timestamp: Date.now(),
        level: 'warning'
      };
      
      return validationError;
    }

    // Generic object error
    return {
      name: objError.name || 'UnknownError',
      message: objError.message || String(error),
      originalError: error,
      timestamp: Date.now(),
      level: 'error'
    };
  }

  // For primitive values or null
  return {
    name: 'UnknownError',
    message: error === null ? 'null error' : String(error),
    originalError: error,
    timestamp: Date.now(),
    level: 'error'
  };
}

/**
 * Determines if an error is a standardized error
 */
function isStandardizedError(error: unknown): error is StandardizedError {
  if (!error || typeof error !== 'object') return false;
  
  const errorObj = error as Partial<StandardizedError>;
  return 'name' in errorObj && 'message' in errorObj;
}

/**
 * Gets a user-friendly error message from an error
 * @param error The error object
 * @returns A user-friendly message
 */
export function getErrorMessage(error: unknown): string {
  // If already a string, return it
  if (typeof error === 'string') return error;
  
  // Handle standardized errors
  if (isStandardizedError(error)) {
    // Use userMessage if available
    if (error.userMessage) return error.userMessage;
    
    // Otherwise use the regular message
    return error.message || 'An unknown error occurred';
  }
  
  // Handle regular errors
  if (error instanceof Error) {
    return error.message || 'An unknown error occurred';
  }
  
  // Handle non-Error objects or primitives
  return String(error || 'An unknown error occurred');
}
