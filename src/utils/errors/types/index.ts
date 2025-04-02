
/**
 * Error level enum
 * Used to categorize errors by severity
 */
export enum ErrorLevel {
  Debug = 'Debug',
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  Critical = 'Critical'
}

/**
 * Error source enum
 * Used to categorize errors by origin/source
 */
export enum ErrorSource {
  Unknown = 'Unknown',
  Component = 'Component',
  Hook = 'Hook',
  Service = 'Service',
  API = 'API',
  Database = 'Database',
  Validation = 'Validation',
  Network = 'Network',
  Authentication = 'Authentication',
  Authorization = 'Authorization',
  App = 'App',
  User = 'User'
}

/**
 * Error handling options
 * Used to configure error handling behavior
 */
export interface ErrorHandlingOptions {
  /**
   * Error severity level
   */
  level: ErrorLevel;
  
  /**
   * Error source/origin
   */
  source: ErrorSource;
  
  /**
   * User-friendly error message
   */
  message: string;
  
  /**
   * Additional context for the error
   */
  context: Record<string, any>;
  
  /**
   * Whether to report to analytics
   */
  reportToAnalytics: boolean;
  
  /**
   * Whether to show toast notification
   */
  showToast: boolean;
  
  /**
   * Whether to suppress toast notification
   * (higher precedence than showToast)
   */
  suppressToast: boolean;
  
  /**
   * Whether to silence all notifications
   */
  silent: boolean;
  
  /**
   * Optional fingerprint for deduplication
   */
  fingerprint?: string;
  
  /**
   * Optional toast ID for updates
   */
  toastId?: string;
  
  /**
   * Optional custom toast title
   */
  toastTitle?: string;
}

/**
 * Legacy error handling options
 * @deprecated Use ErrorHandlingOptions instead
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
 * Basic error tracking info
 */
export interface ErrorTrackingInfo {
  timestamp: number;
  count: number;
}

/**
 * Type alias for error fingerprints
 */
export type ErrorFingerprint = string;

// Re-export all error types from sub-modules
export * from './api-errors';
export * from './validation-errors';
