
import { ValidationResult, ContentValidationResult, ContentIdValidationResult, TagValidationResult } from './types';

/**
 * Create a valid validation result
 */
export function createValidResult(): ValidationResult {
  return {
    isValid: true,
    errorMessage: null
  };
}

/**
 * Create an invalid validation result
 */
export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    errorMessage
  };
}

/**
 * Create a tag validation result for backward compatibility
 */
export function createTagValidationResult(isValid: boolean, message: string | null): TagValidationResult {
  return {
    isValid,
    errorMessage: message,
    message
  };
}

/**
 * Check if a validation result is valid
 */
export function isValidResult(result: ValidationResult): boolean {
  return result.isValid;
}

/**
 * Create a content validation result
 */
export function createContentValidationResult(
  contentId: string,
  isValid: boolean,
  contentExists: boolean,
  errorMessage: string | null
): ContentValidationResult {
  return {
    contentId,
    isValid,
    contentExists,
    errorMessage
  };
}

/**
 * Combine multiple validation results into one
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const invalidResult = results.find(result => !result.isValid);
  
  if (invalidResult) {
    return invalidResult;
  }
  
  return createValidResult();
}

/**
 * Create a content ID validation result with message
 * Ensure compatibility with various validation result structures
 */
export function createContentIdValidationResult(
  result: Partial<ContentIdValidationResult>
): ContentIdValidationResult {
  return {
    isValid: result.isValid || false,
    errorMessage: result.errorMessage || null,
    resultType: result.resultType || 'invalid',
    message: result.message || null,
    contentExists: result.contentExists || false
  };
}
