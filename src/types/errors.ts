
/**
 * Error-related type definitions
 */

export enum ErrorCode {
  UNKNOWN_ERROR = 'unknown_error',
  NETWORK_ERROR = 'network_error',
  AUTH_ERROR = 'auth_error',
  VALIDATION_ERROR = 'validation_error',
  DATABASE_ERROR = 'database_error',
  API_ERROR = 'api_error',
  NOT_FOUND = 'not_found',
  PERMISSION_DENIED = 'permission_denied',
  RATE_LIMITED = 'rate_limited',
  SERVER_ERROR = 'server_error'
}

export enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface ErrorHandlingOptions {
  level?: ErrorLevel;
  errorCode?: ErrorCode;
  context?: Record<string, any>;
  silent?: boolean;
  toast?: boolean;
  technical?: boolean; // Added to support technical error details
}

export interface ErrorDeduplicationOptions {
  maxErrors?: number;
  timeWindow?: number;
  compareKeys?: string[];
}

// Re-export error types from utils/errors/types
export * from '../utils/errors/types';
