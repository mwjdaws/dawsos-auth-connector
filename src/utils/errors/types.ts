
/**
 * Error options for error handling
 */
export interface ErrorOptions {
  // The error message to display
  errorMessage?: string;
  // Additional context data for debugging
  context?: Record<string, any>;
  // Whether to show a toast notification
  silent?: boolean;
  // Error level for logging and UI presentation
  level?: 'error' | 'warning' | 'debug' | 'info';
  // For backward compatibility
  technical?: boolean;
  // Source of the error
  source?: ErrorSource;
  // Severity level
  severity?: 'high' | 'medium' | 'low';
  // Custom fingerprint for error deduplication
  fingerprint?: string;
  // Whether to deduplicate errors
  deduplicate?: boolean;
  // Whether to show notification to the user
  notifyUser?: boolean;
  // Category of error
  category?: string;
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

/**
 * Map error level to toast variant
 */
export const errorLevelToToastVariant: Record<string, "default" | "destructive" | null | undefined> = {
  'error': 'destructive',
  'warning': 'default',
  'info': 'default',
  'debug': null
};

/**
 * Error source categories
 */
export type ErrorSource = 'network' | 'server' | 'database' | 'application' | 'user' | 'unknown';

/**
 * API Error type
 */
export class ApiError extends Error {
  statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Validation Error type
 */
export class ValidationError extends Error {
  field?: string;
  
  constructor(message: string, field?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Error handling compatibility options
 */
export interface ErrorHandlingCompatOptions {
  message?: string;
  level?: string;
  context?: Record<string, any>;
}

/**
 * Error level enum
 */
export enum ErrorLevel {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug'
}
