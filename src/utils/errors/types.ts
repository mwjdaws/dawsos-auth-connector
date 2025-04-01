
/**
 * Error severity levels
 */
export enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// For backward compatibility
export type ErrorSeverity = ErrorLevel | string;

/**
 * Error handling options for consistent error processing
 */
export interface ErrorHandlingOptions {
  level?: ErrorLevel | undefined;
  severity?: ErrorSeverity | undefined; // Backward compatibility
  context?: Record<string, any> | undefined;
  silent?: boolean | undefined;
  userVisible?: boolean | undefined;
  fingerprint?: string | undefined;
  source?: string | undefined;
  category?: string | undefined;
  technical?: boolean | undefined;
}

/**
 * Basic error metadata structure
 */
export interface ErrorMetadata {
  timestamp: number;
  level: ErrorLevel | string;
  context: any;
  fingerprint: string;
  stack: string | undefined;
  isUserVisible: boolean;
  message: string;
  originalError: unknown;
  code: any;
}

/**
 * Enhanced error with additional metadata
 */
export interface EnhancedError extends Error {
  metadata?: ErrorMetadata;
  code?: string;
  context?: Record<string, any>;
  level?: ErrorLevel;
  fingerprint?: string;
}

/**
 * Error sources for categorization
 */
export enum ErrorSource {
  COMPONENT = 'component',
  HOOK = 'hook',
  SERVICE = 'service',
  API = 'api',
  DATABASE = 'database',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

/**
 * API Error type
 */
export class ApiError extends Error {
  statusCode: number;
  code?: string;
  context?: Record<string, any>;

  constructor(message: string, statusCode = 500, code?: string, context?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.context = context;
  }
}

/**
 * Validation Error type
 */
export class ValidationError extends Error {
  field?: string;
  code?: string;
  context?: Record<string, any>;

  constructor(message: string, field?: string, code?: string, context?: Record<string, any>) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
    this.context = context;
  }
}
