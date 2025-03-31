
/**
 * Content ID validation utilities
 */

export type ContentIdValidationResultType = 'valid' | 'invalid' | 'empty';

export interface ContentIdValidationResult {
  isValid: boolean;
  type: ContentIdValidationResultType;
  message: string;
}

/**
 * Validates a content ID
 */
export function isValidContentId(contentId: string | undefined | null): boolean {
  if (!contentId) return false;
  
  // Basic format validation (UUID or temp-ID format)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const tempIdPattern = /^temp-\d+$/;
  
  return uuidPattern.test(contentId) || tempIdPattern.test(contentId);
}

/**
 * Gets detailed validation result for a content ID
 */
export function getContentIdValidationResult(contentId: string | undefined | null): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      type: 'empty',
      message: 'Content ID is empty or undefined'
    };
  }
  
  const isValid = isValidContentId(contentId);
  
  return {
    isValid,
    type: isValid ? 'valid' : 'invalid',
    message: isValid 
      ? 'Content ID is valid' 
      : 'Content ID is invalid. Must be a valid UUID or temporary ID'
  };
}
