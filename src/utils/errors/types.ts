
/**
 * Error handling system types
 */

// Error levels for categorization and filtering
export type ErrorLevel = 'debug' | 'info' | 'warning' | 'error';

// Severity for error impact assessment
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Source of the error for better debugging
export type ErrorSource = 'application' | 'server' | 'network' | 'user' | 'database' | 'unknown';

// Standard error record format
export interface ErrorRecord {
  message: string;
  timestamp: Date;
  level: ErrorLevel;
  source: ErrorSource;
  code?: string;
  context?: Record<string, any>;
  originalError?: Error;
  fingerprint?: string;
  count?: number;
}

// Error options for customizing error handling
export interface ErrorOptions {
  level: ErrorLevel;
  source: ErrorSource;
  severity: ErrorSeverity;
  technical: boolean;
  context: Record<string, any>;
  fingerprint: string;
  deduplicate: boolean;
  deduplicationId?: string;
  silent: boolean;
  notifyUser: boolean;
  category?: string;
}

// Simplified error options for better developer experience
export type ErrorHandlingOptions = Partial<ErrorOptions>;

// Toast variant mapper based on error level
export const errorLevelToToastVariant = {
  debug: 'default',
  info: 'default',
  warning: 'warning',
  error: 'destructive'
} as const;

// Error category for organizing errors
export interface ErrorCategory {
  id: string;
  name: string;
  description: string;
  severity: ErrorSeverity;
  notifyUser: boolean;
}

// Error action for recording user actions
export interface ErrorAction {
  id: string;
  timestamp: Date;
  errorId: string;
  action: 'dismissed' | 'retried' | 'reported';
  userId?: string;
  context?: Record<string, any>;
}
