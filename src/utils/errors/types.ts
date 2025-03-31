
/**
 * Type definitions for error handling
 */

export type ErrorLevel = 'debug' | 'info' | 'warning' | 'error';

export type ErrorCategory = 
  | 'network'
  | 'authentication'
  | 'database'
  | 'validation'
  | 'timeout'
  | 'not_found'
  | 'unknown';

export interface ErrorContext {
  [key: string]: any;
}

export interface ErrorOptions {
  /** Error severity level */
  level?: ErrorLevel;
  
  /** Additional context for the error */
  context?: ErrorContext;
  
  /** Whether to suppress user notification */
  silent?: boolean;
  
  /** Whether this is a technical error that needs special handling */
  technical?: boolean;
  
  /** Whether to deduplicate similar errors */
  deduplicate?: boolean;
}

export interface ErrorInfo {
  message: string;
  originalError: unknown;
  category: ErrorCategory;
  timestamp: number;
}
