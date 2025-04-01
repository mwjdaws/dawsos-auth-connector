
/**
 * Error types and interfaces for the application
 */

/**
 * Error severity levels
 */
export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical'
}

/**
 * Error source categories
 */
export enum ErrorSource {
  UI = 'ui',
  API = 'api',
  Network = 'network',
  Database = 'database',
  Auth = 'auth',
  Unknown = 'unknown',
  System = 'system',
  Validation = 'validation',
  Server = 'server',
  User = 'user'
}

/**
 * Error context structure
 */
export interface ErrorContext {
  [key: string]: any;
}

/**
 * Core error handling options
 */
export interface ErrorHandlingOptions {
  // Error metadata
  level: ErrorLevel;
  source: ErrorSource;
  message: string;
  context?: ErrorContext;
  
  // Toast options
  toastTitle?: string;
  toastDescription?: string;
  toastId?: string;
  fingerprint?: string;
  
  // Behavior flags
  silent?: boolean;
  showToast: boolean;
  suppressToast?: boolean;
  reportToAnalytics?: boolean;
  technical?: boolean;
  originalError?: Error;
}

/**
 * Default error options to use when not specified
 */
export const defaultErrorOptions: ErrorHandlingOptions = {
  level: ErrorLevel.Error,
  source: ErrorSource.Unknown,
  message: 'An unexpected error occurred',
  showToast: true,
  silent: false
};

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage: string | null;
  resultType: 'generic' | 'contentId' | 'tag';
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult extends ValidationResult {
  resultType: 'contentId';
  contentExists: boolean;
}

/**
 * Tag validation result
 */
export interface TagValidationResult extends ValidationResult {
  resultType: 'tag';
}

/**
 * API Error type
 */
export interface ApiError extends Error {
  statusCode?: number;
  apiMessage?: string;
  apiErrorCode?: string;
}

// Helper function to create a content ID validation result
export function createContentIdValidationResult(
  isValid: boolean, 
  contentExists: boolean,
  message: string | null = null,
  errorMessage: string | null = null
): ContentIdValidationResult {
  return {
    isValid,
    contentExists,
    message,
    errorMessage,
    resultType: 'contentId'
  };
}

// Helper function to create a tag validation result
export function createTagValidationResult(
  isValid: boolean,
  message: string | null = null,
  errorMessage: string | null = null
): TagValidationResult {
  return {
    isValid,
    message,
    errorMessage,
    resultType: 'tag'
  };
}

// Helper function to create a generic validation result
export function createValidationResult(
  isValid: boolean,
  message: string | null = null,
  errorMessage: string | null = null
): ValidationResult {
  return {
    isValid,
    message,
    errorMessage,
    resultType: 'generic'
  };
}

// Helper to create content validation result (for compatibility)
export function createContentValidationResult(
  isValid: boolean,
  message: string | null = null,
  errorMessage: string | null = null
): ValidationResult {
  return {
    isValid,
    message,
    errorMessage,
    resultType: 'contentId'
  };
}
