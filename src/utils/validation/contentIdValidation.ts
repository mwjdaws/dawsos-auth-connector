
import { ContentIdValidationResult } from './types';

/**
 * Check if a content ID is valid
 * @param contentId The content ID to validate
 * @returns boolean indicating if the content ID is valid
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  return contentId.length >= 5 && !contentId.startsWith('temp-');
}

/**
 * Get detailed validation result for a content ID
 * @param contentId The content ID to validate
 * @returns ContentIdValidationResult with validity and message
 */
export function getContentIdValidationResult(contentId: string | null | undefined): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      message: 'Content ID is required'
    };
  }

  if (contentId.startsWith('temp-')) {
    return {
      isValid: false,
      message: 'This is a temporary content ID that has not been saved yet'
    };
  }

  if (contentId.length < 5) {
    return {
      isValid: false,
      message: 'Content ID must be at least 5 characters long'
    };
  }

  return {
    isValid: true,
    message: null
  };
}
