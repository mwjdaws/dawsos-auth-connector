
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

/**
 * Validates a content ID
 */
export function validateContentId(contentId?: string | null): ContentIdValidationResult {
  if (contentId === undefined || contentId === null) {
    return {
      isValid: false,
      result: ContentIdValidationResultType.Missing,
      resultType: ContentIdValidationResultType.Missing, // For backward compatibility
      message: 'Content ID is missing'
    };
  }
  
  if (contentId.trim() === '') {
    return {
      isValid: false,
      result: ContentIdValidationResultType.Empty,
      resultType: ContentIdValidationResultType.Empty, // For backward compatibility
      message: 'Content ID is empty'
    };
  }
  
  if (contentId.startsWith('temp-')) {
    return {
      isValid: true,
      result: ContentIdValidationResultType.Temporary,
      resultType: ContentIdValidationResultType.Temporary, // For backward compatibility
      message: 'Content ID is temporary'
    };
  }
  
  if (contentId.length < 3) {
    return {
      isValid: false,
      result: ContentIdValidationResultType.Invalid,
      resultType: ContentIdValidationResultType.Invalid, // For backward compatibility
      message: 'Content ID is too short'
    };
  }
  
  return {
    isValid: true,
    result: ContentIdValidationResultType.Valid,
    resultType: ContentIdValidationResultType.Valid, // For backward compatibility
    message: null
  };
}

/**
 * Simple check if content ID is valid
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
