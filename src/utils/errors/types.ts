
/**
 * Error handling types
 */

// Error severity levels
export enum ErrorLevel {
  Debug = "debug",
  Info = "info",
  Warning = "warning",
  Error = "error",
  Critical = "critical"
}

// Error sources
export enum ErrorSource {
  Unknown = 'unknown',
  User = 'user',
  System = 'system',
  Network = 'network',
  Database = 'database',
  Server = 'server',
  Auth = 'auth',
  Validation = 'validation',
  UI = 'ui',
  API = 'api'
}

// For backward compatibility with older code
export type ErrorSeverity = ErrorLevel;
export type ErrorContext = Record<string, any>;
export type ErrorMetadata = Record<string, any>;

// Enhanced error interface
export interface EnhancedError extends Error {
  level?: ErrorLevel;
  source?: ErrorSource;
  context?: ErrorContext;
  metadata?: ErrorMetadata;
  originalError?: Error;
}

// Options for error handling
export interface ErrorHandlingOptions {
  message?: string;
  level?: ErrorLevel;
  source?: ErrorSource;
  toastTitle?: string;
  toastDescription?: string;
  context?: Record<string, any>;
  originalError?: Error;
  suppressToast?: boolean;
  fingerprint?: string;
  silent?: boolean;
  reportToAnalytics?: boolean;
  showToast?: boolean;
  toastId?: string;
  technical?: string;
}

// Default error options for compatibility
export const defaultErrorOptions: ErrorHandlingOptions = {
  level: ErrorLevel.Error,
  source: ErrorSource.Unknown,
  message: "An unexpected error occurred",
  suppressToast: false,
  silent: false,
  reportToAnalytics: true,
  showToast: true
};

// For users who need a custom type when upgrading
export interface CustomErrorHandlingOptions extends ErrorHandlingOptions {
  [key: string]: any;
}

/**
 * Create a new enhanced error
 */
export function createEnhancedError(
  message: string,
  options?: {
    code?: string;
    level?: ErrorLevel;
    source?: ErrorSource;
    context?: Record<string, any>;
  }
): EnhancedError {
  const error = new Error(message) as EnhancedError;
  if (options) {
    error.code = options.code;
    error.level = options.level;
    error.source = options.source;
    error.context = options.context;
  }
  return error;
}
