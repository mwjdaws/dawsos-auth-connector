
import { ReactNode } from 'react';

/**
 * Error severity levels that can be used for logging
 * - info: Informational message, not critical
 * - warn: Warning that something might be wrong
 * - error: Standard error severity
 * - critical: Critical errors that need immediate attention
 */
export type ErrorLevel = 'info' | 'warn' | 'error' | 'critical';

/**
 * Configuration options for error handling
 */
export interface ErrorHandlingOptions {
  /**
   * The logging level of the error
   * @default 'error'
   */
  level?: ErrorLevel;
  
  /**
   * Additional context information to log with the error
   * Useful for debugging and providing more details about the error state
   */
  context?: Record<string, any>;
  
  /**
   * Whether to include technical details in user-facing messages
   * Should typically be false in production
   * @default false
   */
  technical?: boolean;
  
  /**
   * Whether to suppress user notifications
   * When true, errors are only logged, not displayed to users
   * @default false
   */
  silent?: boolean;
  
  /**
   * Custom title for the error notification
   * @default 'An error occurred'
   */
  title?: string;
  
  /**
   * Label for the action button in the notification
   * If provided along with `action`, an action button will be shown
   */
  actionLabel?: string;
  
  /**
   * Callback function to execute when the action button is clicked
   */
  action?: () => void;
}

/**
 * Standard error format used throughout the application
 * Ensures consistent error structure regardless of original error type
 */
export interface StandardizedError extends Error {
  /**
   * Unique code identifying the error type
   */
  code?: string;
  
  /**
   * HTTP status code (if applicable)
   */
  status?: number;
  
  /**
   * Whether the error is operational (expected) or programmatic (unexpected)
   */
  isOperational?: boolean;
  
  /**
   * Original error object that was thrown
   */
  originalError?: unknown;
}
