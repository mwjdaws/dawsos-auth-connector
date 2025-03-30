
import { StandardizedError, ApiError, ValidationError, ErrorLevel } from './types';
import { getErrorMessage } from './format';

/**
 * Categorizes any error into a standardized error object
 */
export function categorizeError(error: unknown): StandardizedError {
  if (!error) {
    return createStandardizedError('Unknown error', 'error');
  }

  // Already a standardized error
  if (typeof error === 'object' && error !== null && 'handled' in error) {
    return error as StandardizedError;
  }

  // Error instance
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack || '',
      originalError: error,
      timestamp: Date.now(),
    };
  }

  // String error
  if (typeof error === 'string') {
    return createStandardizedError(error, 'error');
  }

  // Object with message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const errorObj = error as any;
    return createStandardizedError(
      typeof errorObj.message === 'string' ? errorObj.message : 'Object error',
      'error',
      errorObj
    );
  }

  // Default fallback
  return createStandardizedError(
    'An unexpected error occurred',
    'error',
    error
  );
}

/**
 * Creates a new standardized error
 */
export function createStandardizedError(
  message: string,
  level: ErrorLevel = 'error',
  originalError?: unknown
): StandardizedError {
  return {
    name: 'ApplicationError',
    message,
    stack: '',
    level,
    originalError,
    timestamp: Date.now(),
  };
}

/**
 * Creates a new API error
 */
export function createApiError(
  message: string,
  statusCode?: number,
  endpoint?: string,
  responseData?: any
): ApiError {
  return {
    name: 'ApiError',
    message,
    stack: '',
    level: 'error',
    statusCode,
    endpoint,
    responseData,
    timestamp: Date.now(),
  };
}

/**
 * Creates a new validation error
 */
export function createValidationError(
  message: string,
  field?: string,
  value?: any
): ValidationError {
  return {
    name: 'ValidationError',
    message,
    stack: '',
    level: 'warning',
    field,
    value,
    timestamp: Date.now(),
  };
}

/**
 * Gets a user-friendly error message from any error type
 */
export { getErrorMessage };
