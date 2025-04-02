
/**
 * Error handling type definitions
 */

/**
 * Error severity level
 */
export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical'
}

/**
 * Error source categories
 */
export enum ErrorSource {
  Unknown = 'unknown',
  User = 'user',
  Component = 'component',
  Hook = 'hook',
  Service = 'service',
  API = 'api',
  Database = 'database',
  Network = 'network',
  Auth = 'auth',
  Storage = 'storage',
  Edge = 'edge',
  System = 'system',
  External = 'external',
  Validation = 'validation'
}

/**
 * Options for error handling
 */
export interface ErrorHandlingOptions {
  /**
   * The severity level of the error
   * @default ErrorLevel.Error
   */
  level?: ErrorLevel;

  /**
   * The source category of the error
   * @default ErrorSource.Unknown
   */
  source?: ErrorSource;

  /**
   * A user-friendly message describing the error
   */
  message?: string;

  /**
   * Additional context about the error (for logging and debugging)
   */
  context?: Record<string, any>;

  /**
   * Whether to report the error to analytics services
   * @default true
   */
  reportToAnalytics?: boolean;

  /**
   * Whether to show a toast notification for the error
   * @default true for ErrorLevel.Error and above
   */
  showToast?: boolean;

  /**
   * Override to suppress toast even if showToast is true
   * Useful for preventing duplicate notifications
   * @default false
   */
  suppressToast?: boolean;

  /**
   * Whether to suppress all notifications and logging
   * @default false
   */
  silent?: boolean;

  /**
   * Optional ID for the toast notification
   */
  toastId?: string;

  /**
   * Optional custom title for the toast notification
   */
  toastTitle?: string;

  /**
   * Unique fingerprint for error deduplication
   */
  fingerprint?: string;

  /**
   * The original error object
   */
  originalError?: Error;
}

/**
 * Legacy interface for error handling options (backward compatibility)
 */
export interface LegacyErrorHandlingOptions {
  level?: ErrorLevel;
  source?: ErrorSource;
  context?: Record<string, any>;
  silent?: boolean;
  showToast?: boolean;
  toastId?: string;
  reportToAnalytics?: boolean;
}

/**
 * Type for error handler function
 */
export type ErrorHandler = (
  error: Error | unknown,
  options?: string | ErrorHandlingOptions
) => void;

/**
 * Contextual error with additional metadata
 */
export interface ContextualError extends Error {
  context?: Record<string, any>;
  source?: ErrorSource;
  level?: ErrorLevel;
}

/**
 * Error with a specific code
 */
export interface CodedError extends Error {
  code: string | number;
}

/**
 * Export all error types from submodules
 */
export * from './validation-errors';
export * from './api-errors';
