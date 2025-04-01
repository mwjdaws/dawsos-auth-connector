
/**
 * Error handling types
 */

// Error levels for categorization
export enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Error context metadata
export interface ErrorContext {
  source?: string;
  component?: string;
  operation?: string;
  user?: string;
  category?: string;
  [key: string]: any;
}

// Error handling options
export interface ErrorHandlingOptions {
  level?: ErrorLevel;
  silent?: boolean;
  context?: ErrorContext;
  reportToService?: boolean;
  showToast?: boolean;
  toastId?: string;
  technical?: boolean; // Added for backward compatibility
  retryable?: boolean;
  deduplicate?: boolean;
  maxRetries?: number;
}

// Error metadata for enhanced error reporting
export interface ErrorMetadata {
  timestamp: number;
  level: ErrorLevel;
  context: ErrorContext;
  fingerprint: string;
  stack?: string;
  isUserVisible: boolean;
  message: string;
  originalError?: any;
  code?: string;
}

// Error handler function type
export type ErrorHandler = (
  error: unknown,
  message?: string,
  options?: Partial<ErrorHandlingOptions>
) => void;

// Component error handler function type
export type ComponentErrorHandler = (
  error: unknown,
  message?: string,
  options?: Partial<ErrorHandlingOptions>
) => void;

// Hook error handler function type
export type HookErrorHandler = (
  error: unknown,
  message?: string,
  options?: Partial<ErrorHandlingOptions>
) => void;

// Service error handler function type
export type ServiceErrorHandler = (
  error: unknown,
  message?: string,
  options?: Partial<ErrorHandlingOptions>
) => void;
