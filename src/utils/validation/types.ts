
/**
 * Base validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
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
