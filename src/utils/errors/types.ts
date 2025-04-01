
/**
 * Error handling type definitions
 */

/**
 * Error severity levels
 */
export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

/**
 * Error source categories
 */
export enum ErrorSource {
  Unknown = 'unknown',
  API = 'api',
  Database = 'database',
  User = 'user',
  Utils = 'utils',
  App = 'app',
  UI = 'ui',
  Auth = 'auth',
  Network = 'network',
  Validation = 'validation',
  Server = 'server',
}

/**
 * Error handling options
 */
export interface ErrorHandlingOptions {
  level: ErrorLevel;
  source: ErrorSource;
  message: string;
  context?: Record<string, any>;
  reportToAnalytics?: boolean;
  showToast?: boolean;
  silent?: boolean;
  fingerprint?: string;
  toastId?: string;
  toastTitle?: string;
  technical?: boolean;
  suppressToast?: boolean;
  originalError?: any;
}

/**
 * Error with detailed information
 */
export interface DetailedError extends Error {
  source?: ErrorSource;
  level?: ErrorLevel;
  context?: Record<string, any>;
  fingerprint?: string;
  originalError?: any;
}

/**
 * Create a detailed error
 */
export function createDetailedError(
  message: string,
  options?: Partial<ErrorHandlingOptions>
): DetailedError {
  const error = new Error(message) as DetailedError;
  
  if (options) {
    error.source = options.source;
    error.level = options.level;
    error.context = options.context;
    error.fingerprint = options.fingerprint;
    error.originalError = options.originalError;
  }
  
  return error;
}
