
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

/**
 * Validates if a content ID is valid
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  
  // Consider valid if:
  // 1. UUID format
  // 2. Temporary ID format (temp-123456789)
  return (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(contentId) ||
    /^temp-\d+$/.test(contentId)
  );
}

/**
 * Gets detailed validation result for a content ID
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      message: "Content ID is missing",
      resultType: ContentIdValidationResultType.MISSING
    };
  }
  
  if (/^temp-\d+$/.test(contentId)) {
    return {
      isValid: true,
      message: "Content ID is temporary",
      resultType: ContentIdValidationResultType.TEMPORARY
    };
  }
  
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(contentId)) {
    return {
      isValid: true,
      message: null,
      resultType: ContentIdValidationResultType.VALID
    };
  }
  
  return {
    isValid: false,
    message: "Content ID is invalid",
    resultType: ContentIdValidationResultType.INVALID
  };
}

// Bridge for backward compatibility
export const ContentIdValidationResult = ContentIdValidationResultType;
