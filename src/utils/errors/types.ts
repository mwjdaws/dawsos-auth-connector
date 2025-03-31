
/**
 * Error Types for standardized error handling
 */

// Error levels for categorization and UI feedback
export type ErrorLevel = 'debug' | 'info' | 'warning' | 'error';

// Base error interface
export interface BaseError {
  name: string;
  message: string;
  stack: string;
  level?: ErrorLevel;
  timestamp: number;
  cause?: unknown;
}

// Standard error that all other errors extend
export interface StandardizedError extends BaseError {
  handled?: boolean;
  id?: string;
  code?: string;
  source?: string;
  originalError?: unknown;
}

// API-specific error
export interface ApiError extends StandardizedError {
  name: 'ApiError';
  statusCode?: number;
  endpoint?: string;
  responseData?: any;
}

// Validation-specific error
export interface ValidationError extends StandardizedError {
  name: 'ValidationError';
  field?: string;
  value?: any;
}

// Application-specific error
export interface ApplicationError extends StandardizedError {
  name: 'ApplicationError';
}

// Network-specific error
export interface NetworkError extends StandardizedError {
  name: 'NetworkError';
  request?: any;
}

// Database-specific error
export interface DatabaseError extends StandardizedError {
  name: 'DatabaseError';
  query?: string;
}

// Authentication-specific error
export interface AuthError extends StandardizedError {
  name: 'AuthError';
}

// Options for withErrorHandling wrapper
export interface WithErrorHandlingOptions {
  errorMessage?: string;
  context?: Record<string, any>;
  silent?: boolean;
  level?: ErrorLevel;
  onError?: (error: any) => void;
  defaultValue?: any;
}

// Compatible options for error handling across different systems
export interface ErrorHandlingCompatOptions {
  context?: Record<string, any>;
  silent?: boolean;
  technical?: boolean;
  title?: string;
  level?: ErrorLevel;
  actionLabel?: string;
  onRetry?: () => void;
  preventDuplicate?: boolean;
  deduplicate?: boolean;
  duration?: number;
}
