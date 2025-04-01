/**
 * Validation utility functions
 */
import { ValidationResult, ContentValidationResult } from './types';

/**
 * Creates a validation result object
 */
export function createValidResult(message?: string): ValidationResult {
  return {
    isValid: true,
    errorMessage: message || null
  };
}

/**
 * Creates an invalid validation result object
 */
export function createInvalidResult(message: string): ValidationResult {
  return {
    isValid: false,
    errorMessage: message
  };
}

/**
 * Creates a content validation result object
 */
export function createContentValidationResult(
  contentId: string,
  exists: boolean,
  isValid: boolean = true,
  errorMessage: string | null = null,
  contentType?: string
): ContentValidationResult {
  return {
    contentId,
    isValid,
    contentExists: exists,
    errorMessage,
    contentType
  };
}

/**
 * Checks if a validation result is valid
 */
export function isValidResult(result: ValidationResult): boolean {
  return result.isValid;
}

/**
 * Combines multiple validation results
 * Returns valid only if all results are valid
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const isValid = results.every(result => result.isValid);
  
  // If valid, return a valid result
  if (isValid) {
    return createValidResult();
  }
  
  // Otherwise, return the first error message
  const firstInvalidResult = results.find(result => !result.isValid);
  return createInvalidResult(
    firstInvalidResult?.errorMessage || 'Validation failed'
  );
}
