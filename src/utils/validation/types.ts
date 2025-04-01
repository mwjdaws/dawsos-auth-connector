
/**
 * Types for validation results and utilities
 */

/**
 * Basic validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message: string;
  resultType?: string;
}

/**
 * Factory for creating a valid validation result
 */
export function createValidResult(message: string = 'Valid'): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    message
  };
}

/**
 * Factory for creating an invalid validation result
 */
export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    message: errorMessage
  };
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult extends ValidationResult {
  contentExists: boolean;
  resultType: ContentIdValidationResultType;
}

/**
 * Validation result types specifically for content IDs
 */
export enum ContentIdValidationResultType {
  VALID = 'VALID',
  MISSING = 'MISSING',
  INVALID_FORMAT = 'INVALID_FORMAT',
  TEMPORARY = 'TEMPORARY',
  NOT_FOUND = 'NOT_FOUND'
}

/**
 * Factory for creating a content ID validation result
 */
export function createContentIdValidationResult(
  isValid: boolean,
  resultType: ContentIdValidationResultType,
  contentExists: boolean = false,
  errorMessage: string | null = null
): ContentIdValidationResult {
  return {
    isValid,
    resultType,
    contentExists,
    errorMessage,
    message: errorMessage || resultType
  };
}

/**
 * Tag validation result
 */
export interface TagValidationResult extends ValidationResult {
  resultType: 'valid' | 'invalid' | 'duplicate';
}

/**
 * Factory for creating a tag validation result
 */
export function createTagValidationResult(
  isValid: boolean,
  resultType: 'valid' | 'invalid' | 'duplicate',
  errorMessage: string | null = null
): TagValidationResult {
  return {
    isValid,
    resultType,
    errorMessage,
    message: errorMessage || resultType
  };
}

/**
 * For backward compatibility with previous validation systems
 */
export type ValidationResultType = 'valid' | 'invalid' | 'missing' | 'temporary' | 'not_found';
