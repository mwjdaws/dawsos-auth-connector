
import { ValidationResult, ContentValidationResult, TagValidationResult } from './types';

/**
 * Create a successful validation result
 * 
 * @param message Optional success message
 * @returns A validation result indicating success
 */
export function createValidResult(message: string = 'Validation passed'): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    message
  };
}

/**
 * Create a failed validation result
 * 
 * @param errorMessage The error message explaining why validation failed
 * @returns A validation result indicating failure
 */
export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    message: null
  };
}

/**
 * Create a content validation result
 * 
 * @param contentId The ID of the content
 * @param isValid Whether the content is valid
 * @param contentExists Whether the content exists
 * @param errorMessage Error message if invalid
 * @param message Success message if valid
 * @returns A content validation result
 */
export function createContentValidationResult(
  contentId: string, 
  isValid: boolean, 
  contentExists: boolean, 
  errorMessage: string | null = null,
  message: string | null = null
): ContentValidationResult {
  return {
    contentId,
    isValid,
    contentExists,
    errorMessage,
    message
  };
}

/**
 * Helper to check if a validation result is valid
 */
export function isValidResult(result: ValidationResult): boolean {
  return result.isValid === true;
}

/**
 * Combines multiple validation results into one
 * 
 * @param results Array of validation results to combine
 * @returns A single validation result
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  // If any result is invalid, the combined result is invalid
  const invalidResult = results.find(result => !result.isValid);
  
  if (invalidResult) {
    return invalidResult;
  }
  
  // All results are valid
  return createValidResult('All validations passed');
}

/**
 * Create a tag validation result
 * 
 * @param isValid Whether the tag is valid
 * @param tagExists Whether the tag exists
 * @param isDuplicate Whether the tag is a duplicate
 * @param isReserved Whether the tag is reserved
 * @param errorMessage Error message if invalid
 * @param message Success message if valid
 * @returns A tag validation result
 */
export function createTagValidationResult(
  isValid: boolean,
  tagExists: boolean = false,
  isDuplicate: boolean = false,
  isReserved: boolean = false,
  errorMessage: string | null = null,
  message: string | null = null
): TagValidationResult {
  return {
    isValid,
    tagExists,
    isDuplicate,
    isReserved,
    errorMessage,
    message
  };
}
