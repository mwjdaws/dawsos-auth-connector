
/**
 * Validation Types
 * 
 * This file defines common validation types used throughout the application.
 * It provides a consistent interface for validation results and related types.
 */

// Generic validation result type for all validations
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage?: string;
  field?: string; // Optional field identifier for form validations
}

/**
 * Tag position for drag-and-drop reordering operations
 * Used when updating the display order of tags in the database
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Content ID validation result types
 * Used to validate that a content ID is properly formatted
 */
export enum ContentIdValidationResultType {
  VALID = 'VALID',
  INVALID_FORMAT = 'INVALID_FORMAT',
  MISSING = 'MISSING',
  EMPTY = 'EMPTY',
  TEMP = 'TEMP',
}

/**
 * Content ID validation result
 * Used to determine if a content ID exists and is valid
 */
export interface ContentIdValidationResult extends ValidationResult {
  type: ContentIdValidationResultType;
  contentExists?: boolean;
}

/**
 * Document validation options
 * Used to configure document validation rules
 */
export interface DocumentValidationOptions {
  requireTitle?: boolean;
  requireContent?: boolean;
  minTitleLength?: number;
  maxTitleLength?: number;
  minContentLength?: number;
  maxContentLength?: number;
}

/**
 * Tag validation options
 * Used to configure tag validation rules
 */
export interface TagValidationOptions {
  requireName?: boolean;
  minNameLength?: number;
  maxNameLength?: number;
  allowDuplicates?: boolean;
}

// Re-export ValidationResult as DocumentValidationResult and TagValidationResult for clarity
export type DocumentValidationResult = ValidationResult;
export type TagValidationResult = ValidationResult;

// Error level for categorizing error severity
export enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Error category for grouping similar errors
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  DATABASE = 'database',
  API = 'api',
  UI = 'ui',
  UNKNOWN = 'unknown'
}

// Context information for errors
export interface ErrorContext {
  level?: ErrorLevel;
  category?: ErrorCategory;
  technical?: boolean;
  userId?: string;
  contentId?: string;
  operation?: string;
  component?: string;
  metadata?: Record<string, any>;
}

// Options for error handling
export interface ErrorOptions {
  errorMessage?: string;
  context?: ErrorContext;
  showToast?: boolean;
  logError?: boolean;
  rethrow?: boolean;
  variant?: 'default' | 'destructive' | 'warning';
}
