
/**
 * Base error types
 */

export enum ErrorSource {
  // Error sources by component type
  Component = 'component',
  Hook = 'hook',
  Service = 'service',
  Util = 'util',
  Api = 'api',
  Database = 'database',
  
  // Error sources by feature area
  Auth = 'auth',
  Network = 'network',
  Validation = 'validation',
  UI = 'ui',
  Server = 'server',
  
  // Default/unknown error source
  Unknown = 'unknown'
}

export enum ErrorLevel {
  // Error severity levels
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical',
  
  // Aliases to make older code work
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface ErrorHandlingOptions {
  // Source of the error
  source: ErrorSource;
  
  // Message for display
  message: string;
  
  // Severity level
  level?: ErrorLevel;
  
  // Additional context for the error
  context?: Record<string, any>;
  
  // Whether to report to analytics
  reportToAnalytics?: boolean;
  
  // Whether to show a toast notification
  showToast?: boolean;
  
  // Whether to suppress error handling completely
  silent?: boolean;
  
  // For toast notifications
  toastTitle?: string;
  toastDescription?: string;
  toastId?: string;
  suppressToast?: boolean;
  
  // For error fingerprinting and deduplication
  fingerprint?: string;
  
  // For technical details
  technical?: string;
  originalError?: Error;
}

// Export API error types
export * from './api-errors';

// Export validation error types
export * from './validation-errors';
