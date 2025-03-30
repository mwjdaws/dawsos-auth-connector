
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

/**
 * Validates a content ID
 */
export function validateContentId(contentId?: string | null): ContentIdValidationResult {
  if (contentId === undefined || contentId === null) {
    return {
      isValid: false,
      result: ContentIdValidationResultType.Missing,
      message: 'Content ID is missing'
    };
  }
  
  if (contentId.trim() === '') {
    return {
      isValid: false,
      result: ContentIdValidationResultType.Empty,
      message: 'Content ID is empty'
    };
  }
  
  if (contentId.length < 3) {
    return {
      isValid: false,
      result: ContentIdValidationResultType.Invalid,
      message: 'Content ID is too short'
    };
  }
  
  return {
    isValid: true,
    result: ContentIdValidationResultType.Valid,
    message: null
  };
}

/**
 * Simple check if content ID is valid
 * @deprecated Use validateContentId instead for richer validation information
 */
export function isValidContentId(contentId?: string | null): boolean {
  return validateContentId(contentId).isValid;
}

/**
 * Get structured validation result for a content ID
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  return validateContentId(contentId);
}
