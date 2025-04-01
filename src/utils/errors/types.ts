
/**
 * Error options for error handling
 */
export interface ErrorOptions {
  // The error message to display
  errorMessage: string;
  // Additional context data for debugging
  context?: Record<string, any>;
  // Whether to show a toast notification
  silent?: boolean;
  // Error level for logging and UI presentation
  level?: 'error' | 'warning' | 'debug' | 'info';
  // For backward compatibility
  technical?: boolean;
}

/**
 * Partial error options for when only some properties are needed
 */
export type PartialErrorOptions = Partial<ErrorOptions>;

/**
 * Result of a wrapped function that can throw
 */
export interface ErrorHandlingResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
}

/**
 * Type of functions that can be wrapped with error handling
 */
export type WrappableFunction<T = any> = (...args: any[]) => Promise<T> | T;

/**
 * Error impact levels for the system
 */
export enum ErrorImpactLevel {
  CRITICAL = 5, // System cannot function
  HIGH = 4,     // Major feature is broken
  MEDIUM = 3,   // Feature partially broken
  LOW = 2,      // Minor issue
  INFO = 1      // Informational
}

/**
 * Error tracking options
 */
export interface ErrorTrackingOptions {
  // Impact level of the error
  impactLevel?: ErrorImpactLevel;
  // Whether this error is user-facing
  userFacing?: boolean;
  // Whether to log to console
  console?: boolean;
  // Whether to send to telemetry service
  telemetry?: boolean;
  // Whether to show notification to user
  notify?: boolean;
}
