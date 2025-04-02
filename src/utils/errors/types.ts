
/**
 * Error handling type definitions
 */

// Error levels for categorizing errors
export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical'
}

// Error sources for identifying where errors originated
export enum ErrorSource {
  Unknown = 'unknown',
  UI = 'ui',
  Component = 'component',
  Hook = 'hook',
  API = 'api',
  Database = 'database',
  Authentication = 'authentication',
  Authorization = 'authorization',
  Validation = 'validation',
  External = 'external',
  Network = 'network',
  System = 'system',
  Service = 'service'
}

// Options for error handling
export interface ErrorHandlingOptions {
  // Core properties
  level?: ErrorLevel;
  source?: ErrorSource;
  message: string;
  context?: Record<string, any>;
  
  // Reporting options
  reportToAnalytics?: boolean;
  showToast?: boolean;
  suppressToast?: boolean;
  
  // Additional options
  silent?: boolean;
  toastId?: string;
  toastTitle?: string;
  fingerprint?: string;
  originalError?: Error;
}

// Basic validation result interface
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  resultType: string;
}

// Content ID validation specific result
export interface ContentIdValidationResult extends ValidationResult {
  contentId: string | null;
}

// Tag validation specific result
export interface TagValidationResult extends ValidationResult {
  // Tag specific validation properties can be added here
}

// Helper functions to create validation results
export function createValidationResult(
  isValid: boolean,
  errorMessage: string | null
): ValidationResult {
  return {
    isValid,
    errorMessage,
    resultType: 'generic'
  };
}

export function createContentIdValidationResult(
  isValid: boolean,
  errorMessage: string | null,
  contentId: string | null
): ContentIdValidationResult {
  return {
    isValid,
    errorMessage,
    contentId,
    resultType: 'contentId'
  };
}

export function createTagValidationResult(
  isValid: boolean,
  errorMessage: string | null
): TagValidationResult {
  return {
    isValid,
    errorMessage,
    resultType: 'tag'
  };
}
