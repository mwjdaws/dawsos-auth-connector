
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

/**
 * Validates a content ID string to ensure it's valid for use
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  // Valid UUIDs and temporary IDs starting with 'temp-' are considered valid
  return (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(contentId) ||
    contentId.startsWith('temp-')
  );
}

/**
 * Performs a more detailed validation of a content ID and returns structured result
 */
export function getContentIdValidationResult(contentId: string | null | undefined): ContentIdValidationResult {
  if (!contentId) {
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
  
  if (contentId.startsWith('temp-')) {
    return {
      isValid: true,
      result: ContentIdValidationResultType.Temporary,
      message: 'Content ID is a temporary ID'
    };
  }
  
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(contentId);
  
  if (isUUID) {
    return {
      isValid: true,
      result: ContentIdValidationResultType.Valid,
      message: null
    };
  }
  
  return {
    isValid: false,
    result: ContentIdValidationResultType.Invalid,
    message: 'Content ID is not a valid UUID or temporary ID'
  };
}
