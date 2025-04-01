
/**
 * Types for validation utilities
 * 
 * These types provide consistent interfaces for validation operations
 * across the application.
 */

/**
 * Standard validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message: string | null;  // Alias for errorMessage for backward compatibility
}

/**
 * Content ID validation result types
 */
export enum ContentIdValidationResultType {
  VALID = 'valid',
  INVALID_FORMAT = 'invalid_format',
  NOT_FOUND = 'not_found',
  TEMP = 'temporary'
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult extends ValidationResult {
  resultType: ContentIdValidationResultType;
  contentExists: boolean;
}

/**
 * Create a content ID validation result
 */
export function createContentIdValidationResult(
  isValid: boolean,
  errorMessage: string | null,
  resultType: ContentIdValidationResultType,
  contentExists: boolean = false
): ContentIdValidationResult {
  return {
    isValid,
    errorMessage,
    message: errorMessage, // Alias for backward compatibility
    resultType,
    contentExists
  };
}

/**
 * Document validation result
 */
export interface DocumentValidationResult extends ValidationResult {
  documentId: string | null;
}

/**
 * Create a document validation result
 */
export function createDocumentValidationResult(
  isValid: boolean,
  errorMessage: string | null,
  documentId: string | null = null
): DocumentValidationResult {
  return {
    isValid,
    errorMessage,
    message: errorMessage, // Alias for backward compatibility
    documentId
  };
}

/**
 * Check if a validation result indicates success
 */
export function isValidResult(result: ValidationResult): boolean {
  return result.isValid === true;
}

/**
 * Combine multiple validation results into one
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  if (!results.length) {
    return { isValid: true, errorMessage: null, message: null };
  }
  
  // Check if any validations failed
  const firstFailure = results.find(r => !r.isValid);
  
  if (firstFailure) {
    return firstFailure;
  }
  
  // All passed
  return { isValid: true, errorMessage: null, message: null };
}
