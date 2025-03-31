
/**
 * Common validation types used across the application
 */

// Content ID validation result types
export enum ContentIdValidationResultType {
  UUID = 'uuid',
  TEMP = 'temp',
  STRING = 'string',
  INVALID = 'invalid'
}

// Basic validation result
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

// Content ID validation result
export interface ContentIdValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  type: string;
}

// Document validation result
export interface DocumentValidationResult extends ValidationResult {
  field?: string;
}

// Tag validation options
export interface TagValidationOptions {
  minLength?: number;
  maxLength?: number;
  allowEmpty?: boolean;
  allowSpecialChars?: boolean;
  allowDuplicates?: boolean;
}

// Document validation options
export interface DocumentValidationOptions {
  titleRequired?: boolean;
  minTitleLength?: number;
  maxTitleLength?: number;
  contentRequired?: boolean;
  minContentLength?: number;
  maxContentLength?: number;
}

// Tag position type for reordering
export interface TagPosition {
  id: string;
  position: number;
}

// Validation compatibility utilities
export const createValidationResult = (isValid: boolean, errorMessage: string | null): ValidationResult => ({
  isValid,
  errorMessage
});

// Common validation results
export const VALIDATION_RESULTS = {
  VALID: createValidationResult(true, null),
  INVALID: createValidationResult(false, "Invalid input"),
  REQUIRED: createValidationResult(false, "This field is required"),
  TOO_SHORT: createValidationResult(false, "Input is too short"),
  TOO_LONG: createValidationResult(false, "Input is too long"),
  INVALID_FORMAT: createValidationResult(false, "Invalid format")
};
