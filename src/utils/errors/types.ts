
/**
 * Error handling types
 */

/**
 * Enum for error levels
 */
export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical'
}

/**
 * Enum for error sources
 */
export enum ErrorSource {
  UI = 'ui',
  API = 'api',
  Database = 'database',
  Auth = 'auth',
  Network = 'network',
  External = 'external',
  Unknown = 'unknown'
}

/**
 * Error context interface
 */
export type ErrorContext = Record<string, any>;

/**
 * Error handling options interface
 */
export interface ErrorHandlingOptions {
  level: ErrorLevel;
  source: ErrorSource;
  message: string;
  toastTitle: string;
  toastDescription: string;
  context: ErrorContext;
  technical: boolean;
  contentId: string;
  silent: boolean;
  showToast: boolean;
}

/**
 * Partial error handling options - all fields are optional
 */
export type PartialErrorHandlingOptions = Partial<ErrorHandlingOptions>;

/**
 * API error response interface
 */
export interface ApiErrorResponse {
  message: string;
  details?: string;
  code?: string;
  status?: number;
}

/**
 * Base error class for application
 */
export class ApplicationError extends Error {
  public readonly level: ErrorLevel;
  public readonly source: ErrorSource;
  public readonly context: ErrorContext;
  
  constructor(
    message: string,
    level: ErrorLevel = ErrorLevel.Error, 
    source: ErrorSource = ErrorSource.Unknown,
    context: ErrorContext = {}
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.level = level;
    this.source = source;
    this.context = context;
  }
}

/**
 * Error thrown for API related errors
 */
export class ApiError extends ApplicationError {
  public readonly status: number;
  public readonly endpoint: string;
  
  constructor(
    message: string, 
    status: number = 500, 
    endpoint: string = '', 
    context: ErrorContext = {}
  ) {
    super(message, ErrorLevel.Error, ErrorSource.API, context);
    this.name = 'ApiError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

/**
 * Error thrown for validation errors
 */
export class ValidationError extends ApplicationError {
  public readonly field?: string;
  
  constructor(
    message: string, 
    field?: string,
    context: ErrorContext = {}
  ) {
    super(message, ErrorLevel.Warning, ErrorSource.UI, context);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Error thrown for permissions errors
 */
export class PermissionError extends ApplicationError {
  public readonly requiredPermission?: string;
  
  constructor(
    message: string, 
    requiredPermission?: string,
    context: ErrorContext = {}
  ) {
    super(message, ErrorLevel.Error, ErrorSource.Auth, context);
    this.name = 'PermissionError';
    this.requiredPermission = requiredPermission;
  }
}
