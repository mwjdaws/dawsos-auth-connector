
/**
 * Base validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  contentExists?: boolean; // Added to support backward compatibility
  message?: string | null; // Added to support backward compatibility
}

/**
 * Content ID validation result types
 */
export enum ContentIdValidationResultType {
  VALID = 'valid',
  UUID = 'uuid',
  TEMP = 'temp',
  INVALID = 'invalid'
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult extends ValidationResult {
  resultType: ContentIdValidationResultType;
  message: string | null;
  contentExists: boolean;
}

/**
 * Content validation result
 */
export interface ContentValidationResult extends ValidationResult {
  contentId: string;
  contentExists: boolean;
}

/**
 * Tag validation result for backward compatibility
 */
export interface TagValidationResult extends ValidationResult {
  message?: string | null;
  tagExists?: boolean; // Added to support older code
}

/**
 * Simple wrapper for standard validation result
 */
export interface SimpleValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Document validation result
 */
export interface DocumentValidationResult extends ValidationResult {
  documentId: string;
  exists: boolean;
}

/**
 * Document validation options
 */
export interface DocumentValidationOptions {
  requireTitle?: boolean;
  minTitleLength?: number;
  maxTitleLength?: number;
  requireContent?: boolean;
  minContentLength?: number;
}

/**
 * Error handling compatibility options
 */
export interface ErrorHandlingCompatOptions {
  level?: string;
  context?: Record<string, any>;
  technical?: boolean;
  category?: string;
}

// Add ErrorHandlingOptions for backwards compatibility
export interface ErrorHandlingOptions {
  level?: string;
  source?: string;
  severity?: string;
  technical?: boolean;
  context?: Record<string, any>;
  fingerprint?: string;
  deduplicate?: boolean;
  silent?: boolean;
  notifyUser?: boolean;
  category?: string;
}

// Add constants for validation results
export const VALIDATION_RESULTS = {
  VALID: 'valid',
  INVALID: 'invalid'
};

// Helper functions for creating validation results
export function createValidResult(message: string | null = null): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    message
  };
}

export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    message: errorMessage
  };
}
