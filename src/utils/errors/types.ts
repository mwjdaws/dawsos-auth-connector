
import React from 'react';

/**
 * Error severity levels
 */
export enum ErrorLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

/**
 * Types of error sources
 */
export enum ErrorSource {
  API = 'api',
  DATABASE = 'database',
  VALIDATION = 'validation',
  UI = 'ui',
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  UNKNOWN = 'unknown'
}

/**
 * Options for error handling
 */
export interface ErrorHandlingOptions {
  /**
   * The severity level of the error
   */
  level: ErrorLevel;

  /**
   * Whether to show a toast notification for this error
   */
  showToast: boolean;

  /**
   * Whether to report this error to analytics
   */
  reportToAnalytics: boolean;

  /**
   * Whether to handle this error silently (no user-facing notifications)
   */
  silent: boolean;

  /**
   * Additional context information for debugging
   */
  context?: Record<string, any>;

  /**
   * Custom title for toast notification
   */
  toastTitle?: string;

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
   * Error source for categorization
   */
  source?: ErrorSource;

  /**
   * Technical error details (not displayed to users)
   */
  technical?: string;
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
 * Legacy options for backward compatibility
 */
export interface ErrorHandlingCompatOptions {
  level?: string;
  technical?: string;
  silent?: boolean;
  source?: string;
  [key: string]: any;
}

/**
 * Custom validation error type
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Custom API error type
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
