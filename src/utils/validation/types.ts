
/**
 * Validation utility types
 */

// Basic validation result
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

// Content ID validation result types
export enum ContentIdValidationResultType {
  VALID = 'valid',
  EMPTY = 'empty',
  INVALID_FORMAT = 'invalid_format',
  NOT_FOUND = 'not_found'
}

// Content ID validation result
export interface ContentIdValidationResult {
  isValid: boolean;
  contentExists: boolean;
  resultType: ContentIdValidationResultType;
  message: string | null;
}

// Document validation result
export interface DocumentValidationResult {
  isValid: boolean;
  contentExists: boolean;
  resultType: string;
  errorMessage: string | null;
}

// Tag validation options
export interface TagValidationOptions {
  allowSpaces?: boolean;
  minLength?: number;
  maxLength?: number;
  allowSpecialChars?: boolean;
}

// Document validation options
export interface DocumentValidationOptions {
  requireTitle?: boolean;
  requireContent?: boolean;
  minTitleLength?: number;
  maxTitleLength?: number;
  minContentLength?: number;
  maxContentLength?: number;
}

// Tag position for reordering
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Creates a validation result object
 * 
 * @param isValid Whether the validation passed
 * @param errorMessage Error message if validation failed
 * @returns A validation result object
 */
export function createValidationResult(
  isValid: boolean,
  errorMessage: string | null = null
): ValidationResult {
  return {
    isValid,
    errorMessage: isValid ? null : errorMessage
  };
}

// Predefined validation result values
export const VALIDATION_RESULTS = {
  VALID: createValidationResult(true, null),
  EMPTY_TITLE: createValidationResult(false, 'Title cannot be empty'),
  EMPTY_CONTENT: createValidationResult(false, 'Content cannot be empty'),
  TITLE_TOO_LONG: createValidationResult(false, 'Title is too long'),
  TITLE_TOO_SHORT: createValidationResult(false, 'Title is too short'),
  CONTENT_TOO_LONG: createValidationResult(false, 'Content is too long'),
  CONTENT_TOO_SHORT: createValidationResult(false, 'Content is too short'),
  INVALID_FORMAT: createValidationResult(false, 'Invalid format'),
  NOT_FOUND: createValidationResult(false, 'Not found')
};
