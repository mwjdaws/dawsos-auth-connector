
/**
 * Content ID validation utility functions
 */

// Define validation result types
export type ContentIdValidationResultType = 'valid' | 'invalid' | 'temporary' | 'missing';

export interface ContentIdValidationResult {
  isValid: boolean;
  resultType: ContentIdValidationResultType;
  message: string;
}

// UUID v4 regex pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Temporary ID pattern (for drafts)
const TEMP_PATTERN = /^temp-[a-f0-9-]+$/i;

/**
 * Check if a string is a valid content ID (UUID v4)
 */
export function isValidContentId(id: string | null | undefined): boolean {
  if (!id) return false;
  return UUID_PATTERN.test(id) || TEMP_PATTERN.test(id);
}

/**
 * Check if the ID is a temporary draft ID
 */
export function isTemporaryContentId(id: string | null | undefined): boolean {
  if (!id) return false;
  return TEMP_PATTERN.test(id);
}

/**
 * Get detailed validation result for a content ID
 */
export function getContentIdValidationResult(id: string | null | undefined): ContentIdValidationResult {
  if (!id) {
    return {
      isValid: false,
      resultType: 'missing',
      message: 'Content ID is missing'
    };
  }
  
  if (isTemporaryContentId(id)) {
    return {
      isValid: true, // Temp IDs are valid for drafts
      resultType: 'temporary',
      message: 'Temporary draft ID'
    };
  }
  
  if (isValidContentId(id)) {
    return {
      isValid: true,
      resultType: 'valid',
      message: 'Valid content ID'
    };
  }
  
  return {
    isValid: false,
    resultType: 'invalid',
    message: 'Invalid content ID format'
  };
}
