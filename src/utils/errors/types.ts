
/**
 * Error handling type definitions
 */

// Error severity levels
export type ErrorLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

// Standardized error object for consistent error handling
export interface StandardizedError extends Error {
  originalError: unknown;
  userMessage: string;
  timestamp: number;
  context?: Record<string, any>;
  code?: string;
  source?: string;
  technical?: boolean;
  silent?: boolean;
  level?: ErrorLevel;
}

// API error specific structure
export interface ApiError extends StandardizedError {
  statusCode?: number;
  endpoint?: string;
  requestId?: string;
  responseData?: any;
}

// Validation error
export interface ValidationError extends StandardizedError {
  field?: string;
  value?: any;
  constraints?: Record<string, string>;
}

// Options for error handling
export interface ErrorHandlingOptions {
  level?: ErrorLevel;
  context?: Record<string, any>;
  silent?: boolean;
  technical?: boolean;
  title?: string;
  actionLabel?: string;
  onRetry?: () => void;
  preventDuplicate?: boolean;
  duration?: number;
}

// Type guard to check if an error is a StandardizedError
export function isStandardizedError(error: unknown): error is StandardizedError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'originalError' in error &&
    'userMessage' in error &&
    'timestamp' in error
  );
}

// Type guard to check if an error is an ApiError
export function isApiError(error: unknown): error is ApiError {
  return (
    isStandardizedError(error) &&
    'statusCode' in error
  );
}

// Type guard to check if an error is a ValidationError
export function isValidationError(error: unknown): error is ValidationError {
  return (
    isStandardizedError(error) &&
    'field' in error
  );
}
