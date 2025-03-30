
/**
 * Error handling types
 */

// Error severity levels
export type ErrorLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

// Error classification
export enum ErrorCategory {
  NETWORK = 'network',
  AUTH = 'authentication',
  VALIDATION = 'validation',
  DATABASE = 'database',
  PERMISSION = 'permission',
  API = 'api',
  TIMEOUT = 'timeout',
  SYSTEM = 'system',
  UNKNOWN = 'unknown'
}

// Error handling options
export interface ErrorHandlingOptions {
  // Error severity
  level?: ErrorLevel;
  
  // Additional context for debugging
  context?: Record<string, any>;
  
  // Don't show toast notification if true
  silent?: boolean;
  
  // Is this a technical error (for developer) or user-facing
  technical?: boolean;
  
  // Custom toast title
  title?: string;
  
  // Retry button label
  actionLabel?: string;
  
  // Retry action
  onRetry?: () => void;
  
  // Prevent showing duplicate errors
  preventDuplicate?: boolean;
  
  // Toast duration
  duration?: number;
}

// Standardized error object
export interface StandardizedError {
  // Original error object
  originalError: unknown;
  
  // Error message for developers
  message: string;
  
  // User-friendly message
  userMessage: string;
  
  // Error code if available
  code?: string;
  
  // When the error occurred
  timestamp: Date;
  
  // Error context data
  context: Record<string, any>;
}
