
import React from 'react';

/**
 * Error severity levels
 */
export enum ErrorLevel {
  Debug = 'Debug',
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  Critical = 'Critical'
}

/**
 * Types of error sources
 */
export enum ErrorSource {
  Api = 'API',
  Database = 'DATABASE',
  Validation = 'VALIDATION',
  Ui = 'UI',
  Network = 'NETWORK',
  Authentication = 'AUTHENTICATION',
  Unknown = 'UNKNOWN'
}

/**
 * Options for error handling
 */
export interface ErrorHandlingOptions {
  /**
   * The severity level of the error
   */
  level?: ErrorLevel;

  /**
   * Whether to show a toast notification for this error
   */
  showToast?: boolean;

  /**
   * Whether to report this error to analytics
   */
  reportToAnalytics?: boolean;

  /**
   * Whether to handle this error silently (no user-facing notifications)
   */
  silent?: boolean;

  /**
   * Additional context information for debugging
   */
  context?: Record<string, any>;

  /**
   * Custom title for toast notification
   */
  toastTitle?: string;

  /**
   * User-friendly message to display
   */
  message?: string;

  /**
   * Fingerprint for error deduplication
   */
  fingerprint?: string;

  /**
   * Error retry attempt count
   * @default 0
   */
  retryCount?: number;

  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxRetries?: number;

  /**
   * Error category for grouping similar errors
   */
  category?: string;
  
  /**
   * Technical details about the error (for developer-facing messages)
   */
  technical?: string;
  
  /**
   * Source of the error
   */
  source?: ErrorSource;
}

/**
 * Error with additional metadata
 */
export interface EnhancedError extends Error {
  /**
   * HTTP status code if available
   */
  status?: number;

  /**
   * Original error that caused this error
   */
  originalError?: Error;

  /**
   * Error code for specific error types
   */
  code?: string;

  /**
   * Error timestamp
   */
  timestamp?: string;
  
  /**
   * Error level
   */
  level?: ErrorLevel;
  
  /**
   * Error source
   */
  source?: ErrorSource;
  
  /**
   * Additional context
   */
  context?: Record<string, any>;
}

/**
 * Toast notification configuration for errors
 */
export interface ErrorToastConfig {
  /**
   * Toast title
   */
  title: string;

  /**
   * Toast description
   */
  description: string;

  /**
   * Toast variant
   */
  variant?: 'default' | 'destructive';

  /**
   * Toast duration in milliseconds
   */
  duration?: number;

  /**
   * Action component to display in toast
   */
  action?: React.ReactNode;
}

/**
 * Result of error handling operation
 */
export interface ErrorHandlingResult {
  /**
   * Whether the error was handled successfully
   */
  handled: boolean;

  /**
   * Toast ID if a toast was shown
   */
  toastId?: string;

  /**
   * Error message that was displayed to the user
   */
  userMessage?: string;

  /**
   * Original error that was handled
   */
  error: Error;
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
