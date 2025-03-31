
/**
 * Error handling type definitions
 * 
 * Type definitions for error handling utilities.
 */

// Error severity levels
export type ErrorLevel = 'debug' | 'info' | 'warning' | 'error';

// Error context information
export interface ErrorContext {
  [key: string]: any;
}

// Error handling options
export interface ErrorOptions {
  // Error severity level
  level?: ErrorLevel;
  
  // Additional context information for debugging
  context?: ErrorContext;
  
  // Whether to show a user notification
  silent?: boolean;
  
  // Whether this is a technical error (for internal use)
  technical?: boolean;
  
  // Whether to deduplicate this error message
  deduplicate?: boolean;
}

// Tagged error types (for categorization)
export interface TaggedError extends Error {
  errorType?: string;
  statusCode?: number;
  context?: ErrorContext;
}
