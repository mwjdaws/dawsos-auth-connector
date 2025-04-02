
/**
 * Error handling types
 */

// Error severity levels
export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Fatal = 'fatal'
}

// Source of the error
export enum ErrorSource {
  API = 'api',
  Hook = 'hook',
  Component = 'component',
  Validation = 'validation',
  Database = 'database',
  Authentication = 'authentication',
  Unknown = 'unknown'
}

// Base error handling options
export interface ErrorHandlingOptions {
  level: ErrorLevel;
  source: ErrorSource;
  message: string;
  context?: Record<string, any>;
  reportToAnalytics?: boolean;
  showToast?: boolean;
  suppressToast?: boolean;
  silent?: boolean;
  fingerprint?: string;
  toastId?: string;
  toastTitle?: string;
}

// Default error handling options
export const DEFAULT_ERROR_OPTIONS: ErrorHandlingOptions = {
  level: ErrorLevel.Error,
  source: ErrorSource.Unknown,
  message: 'An error occurred',
  context: {},
  reportToAnalytics: true,
  showToast: true,
  suppressToast: false,
  silent: false
};

// Export for backward compatibility
export const ERROR_LEVEL = ErrorLevel;
export const ERROR_SOURCE = ErrorSource;
