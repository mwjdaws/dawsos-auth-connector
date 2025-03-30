
/**
 * Content ID validation utilities
 */

// Valid content ID patterns
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TEMP_ID_REGEX = /^temp-\d+$/;

export enum ContentIdValidationResultType {
  VALID_UUID = 'VALID_UUID',
  VALID_TEMP_ID = 'VALID_TEMP_ID',
  INVALID = 'INVALID',
  EMPTY = 'EMPTY'
}

export interface ContentIdValidationResult {
  isValid: boolean;
  resultType: ContentIdValidationResultType;
  message: string;
}

/**
 * Validates a content ID
 * @param contentId The content ID to validate
 * @returns True if the content ID is valid
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  return UUID_REGEX.test(contentId) || TEMP_ID_REGEX.test(contentId);
}

/**
 * Gets detailed validation result for a content ID
 * @param contentId The content ID to validate
 * @returns Validation result object
 */
export function getContentIdValidationResult(contentId: string | null | undefined): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      resultType: ContentIdValidationResultType.EMPTY,
      message: 'Content ID is required'
    };
  }
  
  if (UUID_REGEX.test(contentId)) {
    return {
      isValid: true,
      resultType: ContentIdValidationResultType.VALID_UUID,
      message: 'Valid UUID'
    };
  }
  
  if (TEMP_ID_REGEX.test(contentId)) {
    return {
      isValid: true,
      resultType: ContentIdValidationResultType.VALID_TEMP_ID,
      message: 'Valid temporary ID'
    };
  }
  
  return {
    isValid: false,
    resultType: ContentIdValidationResultType.INVALID,
    message: 'Invalid content ID format'
  };
}
