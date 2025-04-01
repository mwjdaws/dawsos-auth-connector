
/**
 * Core error types and enums
 */

/**
 * Error severity level
 */
export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical',
  
  // For backward compatibility
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Error source categories
 */
export enum ErrorSource {
  // Primary sources
  API = 'api',
  Utils = 'utils',
  Database = 'database',
  Component = 'component',
  App = 'app',
  
  // For compatibility with existing code
  Network = 'network',
  Auth = 'auth',
  Validation = 'validation',
  Server = 'server',
  UI = 'ui',

  // Backward compatibility
  Api = 'api',
  Util = 'utils'
}

/**
 * Base error handling options
 */
export interface ErrorHandlingOptions {
  // Required properties
  source: ErrorSource | string;
  message: string;
  level: ErrorLevel;

  // Optional properties
  reportToAnalytics?: boolean;
  showToast?: boolean;
  silent?: boolean;
  
  // For compatibility with existing code
  fingerprint?: string;
  suppressToast?: boolean;
  toastId?: string;
  technical?: boolean;
  originalError?: any;
}

/**
 * Default options for error handling
 */
export const defaultErrorOptions: Partial<ErrorHandlingOptions> = {
  level: ErrorLevel.Error,
  reportToAnalytics: true,
  showToast: true,
  silent: false
};

// Utility type for partial error options
export type PartialErrorOptions = Partial<ErrorHandlingOptions>;
