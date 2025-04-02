
/**
 * Error handling types
 */

/**
 * Error severity levels
 */
export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical'
}

/**
 * Error sources
 */
export enum ErrorSource {
  Unknown = 'unknown',
  User = 'user',
  Application = 'application',
  Component = 'component',
  Hook = 'hook',
  API = 'api',
  Database = 'database',
  Network = 'network',
  Validation = 'validation',
  Service = 'service'
}

/**
 * Error handling options
 */
export interface ErrorHandlingOptions {
  // Error metadata
  level: ErrorLevel;
  source: ErrorSource;
  message: string;
  context?: Record<string, any>;
  fingerprint?: string;
  
  // Behavior flags
  silent?: boolean;
  showToast?: boolean;
  suppressToast?: boolean;
  toastId?: string;
  toastTitle?: string;
  
  // Reporting options
  reportToAnalytics?: boolean;
}

/**
 * Error with additional context
 */
export interface ContextualError extends Error {
  context?: Record<string, any>;
  source?: ErrorSource;
  level?: ErrorLevel;
}

