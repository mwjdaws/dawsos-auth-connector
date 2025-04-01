
/**
 * Generic validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Create a valid validation result
 */
export function createValidResult(): ValidationResult {
  return {
    isValid: true,
    errorMessage: null
  };
}

/**
 * Create an invalid validation result
 */
export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    errorMessage
  };
}

/**
 * Content validation result
 */
export interface ContentValidationResult extends ValidationResult {
  contentId: string;
  contentExists: boolean;
}

/**
 * Content ID validation result types
 */
export enum ContentIdValidationResultType {
  VALID = 'valid',
  INVALID = 'invalid',
  UUID = 'uuid',
  TEMP = 'temp'
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult extends ValidationResult {
  message?: string | null;
  resultType: ContentIdValidationResultType;
  contentExists?: boolean;
}

/**
 * Error handling options
 */
export interface ErrorHandlingOptions {
  level?: 'debug' | 'info' | 'warning' | 'error';
  context?: Record<string, any>;
  silent?: boolean;
  reportToAnalytics?: boolean;
  showToast?: boolean;
  toastTitle?: string;
  technical?: boolean;
}

/**
 * Legacy error handling options for compatibility
 */
export interface ErrorHandlingCompatOptions {
  level?: 'debug' | 'info' | 'warning' | 'error';
  context?: Record<string, any>;
  silent?: boolean;
  reportToAnalytics?: boolean;
  showToast?: boolean;
  toastTitle?: string;
  technical?: boolean;
  category?: string;
}

/**
 * Error severity enum
 */
export enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

/**
 * Error options
 */
export interface ErrorOptions {
  message: string;
  level: ErrorLevel;
  code?: number;
  context: Record<string, any>;
}

/**
 * Partial error options
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};
