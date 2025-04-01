
import { ValidationResult, ContentIdValidationResult, createValidResult, createInvalidResult, createContentIdValidationResult } from './types';

/**
 * Legacy validation result structure
 */
export interface LegacyValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Legacy content validation result structure
 */
export interface LegacyContentValidationResult extends LegacyValidationResult {
  contentExists: boolean | null;
}

/**
 * Convert between validation result formats
 */
export function convertValidationResult(result: ValidationResult | LegacyValidationResult): ValidationResult {
  if ('message' in result) {
    return result as ValidationResult;
  }
  
  return {
    isValid: result.isValid,
    errorMessage: result.errorMessage,
    message: null
  };
}

/**
 * Convert content validation result formats
 */
export function convertContentValidationResult(
  result: ContentIdValidationResult | LegacyContentValidationResult
): ContentIdValidationResult {
  if ('resultType' in result) {
    return result as ContentIdValidationResult;
  }
  
  return {
    isValid: result.isValid,
    errorMessage: result.errorMessage,
    message: null,
    contentExists: result.contentExists,
    resultType: 'content-id'
  };
}

/**
 * Create a validation result from legacy format
 */
export function createValidationResultFromLegacy(
  isValid: boolean,
  errorMessage: string | null
): ValidationResult {
  return isValid ? createValidResult() : createInvalidResult(errorMessage || 'Validation failed');
}
