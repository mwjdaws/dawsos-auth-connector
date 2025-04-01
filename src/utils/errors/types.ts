
/**
 * Error handling types
 */

// Error severity levels
export enum ErrorLevel {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
  Critical = 4
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
  message: string;
  level: ErrorLevel;
  source: ErrorSource;
  toastTitle?: string;
  toastDescription?: string;
  context?: Record<string, any>;
  originalError?: Error;
  suppressToast?: boolean;
}

// For users who need a custom type when upgrading
export interface CustomErrorHandlingOptions extends ErrorHandlingOptions {
  [key: string]: any;
}
