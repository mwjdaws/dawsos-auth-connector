
/**
 * Core error handling types
 */

/**
 * Error severity levels
 */
export enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

/**
 * Source of an error
 */
export enum ErrorSource {
  COMPONENT = 'component',
  HOOK = 'hook',
  SERVICE = 'service',
  API = 'api',
  UNKNOWN = 'unknown'
}

/**
 * Error handling options for improved context and handling
 */
export interface ErrorHandlingOptions {
  // Error metadata
  level?: ErrorLevel;
  source?: ErrorSource | string;
  fingerprint?: string;
  context?: Record<string, any>;
  
  // For UI-related errors
  showToast?: boolean;
  toastId?: string;
  userMessage?: string;
  technical?: string; // Technical details (for backwards compatibility)
}

/**
 * Enhanced error with additional context
 */
export interface EnhancedError extends Error {
  level?: ErrorLevel;
  source?: ErrorSource | string;
  fingerprint?: string;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Specialized error types for common scenarios
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
