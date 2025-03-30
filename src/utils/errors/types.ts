
/**
 * Error handling types for the application
 */

// Error category/severity level
export type ErrorLevel = 'debug' | 'info' | 'warning' | 'error';

// Standardized error interface
export interface StandardizedError extends Error {
  code?: string;        // Error code for categorization
  status?: number;      // HTTP status code if applicable
  originalError?: any;  // Original error object before standardization
}

// Options for error handling
export interface ErrorHandlingOptions {
  level?: ErrorLevel;                 // Severity level
  context?: Record<string, any>;      // Additional context for debugging
  silent?: boolean;                   // Suppress UI notifications
  technical?: boolean;                // Show technical details in UI
  title?: string;                     // Custom title for notifications
  actionLabel?: string;               // Label for action button
  action?: () => void;                // Action to be performed
  preventDuplicate?: boolean;         // Prevent showing duplicate toasts
  duration?: number;                  // Duration to show toast (ms)
}

/**
 * API Error class for standardized API errors
 */
export class ApiError extends Error {
  code: number;
  
  constructor(message: string, code: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

/**
 * Validation Error class for input validation errors
 */
export class ValidationError extends Error {
  fieldErrors?: Record<string, string>;
  
  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}
