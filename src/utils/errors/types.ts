
/**
 * Error handling types
 */

/**
 * Error severity levels
 */
export type ErrorSeverity = 'debug' | 'info' | 'warning' | 'error';

/**
 * Error level enum
 */
export enum ErrorLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

/**
 * Error source categories
 */
export enum ErrorSource {
  API = 'API',
  DATABASE = 'DATABASE',
  UI = 'UI',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  PERMISSIONS = 'PERMISSIONS',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Error handling options
 */
export interface ErrorHandlingOptions {
  level?: ErrorSeverity | ErrorLevel;
  context?: Record<string, any>;
  silent?: boolean;
  reportToAnalytics?: boolean;
  showToast?: boolean;
  toastTitle?: string;
  toastId?: string;
}

/**
 * Error with enhanced properties
 */
export interface EnhancedError extends Error {
  code?: string;
  level?: ErrorLevel;
  source?: ErrorSource;
  context?: Record<string, any>;
}

/**
 * Error boundary fallback props
 */
export interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Create a new enhanced error
 */
export function createEnhancedError(
  message: string,
  options?: {
    code?: string;
    level?: ErrorLevel;
    source?: ErrorSource;
    context?: Record<string, any>;
  }
): EnhancedError {
  const error = new Error(message) as EnhancedError;
  if (options) {
    error.code = options.code;
    error.level = options.level;
    error.source = options.source;
    error.context = options.context;
  }
  return error;
}
