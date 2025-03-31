
/**
 * Validation utilities
 */
import { getContentIdValidationResult as getContentIdValidationResultInternal, isValidContentId as isValidContentIdInternal } from './validation/contentIdValidation';
import { ContentIdValidationResult } from './validation/types';

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Validates if a string is a valid content ID
 * @param contentId The content ID to validate
 * @returns True if the content ID is valid
 */
export function isValidContentId(contentId?: string | null): boolean {
  return isValidContentIdInternal(contentId);
}

/**
 * Gets a validation result for a content ID
 * @param contentId The content ID to validate
 * @returns A validation result object
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  const result = getContentIdValidationResultInternal(contentId);
  return {
    isValid: result.isValid,
    errorMessage: result.errorMessage,
    message: result.message,
    resultType: result.resultType
  };
}
