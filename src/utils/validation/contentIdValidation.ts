
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

/**
 * Validates if a content ID is valid
 * @param contentId The content ID to validate
 * @returns Boolean indicating if the content ID is valid
 */
export function isValidContentId(contentId: string | null | undefined): contentId is string {
  if (!contentId) return false;
  
  // Temporary IDs should be considered valid but with special handling
  if (contentId.startsWith('temp-')) return true;
  
  // UUID format validation (basic check)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(contentId);
}

/**
 * Gets detailed validation result for a content ID
 * @param contentId The content ID to validate
 * @returns Validation result object with details
 */
export function getContentIdValidationResult(contentId: string | null | undefined): ContentIdValidationResultType {
  if (!contentId) {
    return ContentIdValidationResultType.MISSING;
  }
  
  if (contentId.startsWith('temp-')) {
    return ContentIdValidationResultType.TEMPORARY;
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(contentId) 
    ? ContentIdValidationResultType.VALID 
    : ContentIdValidationResultType.INVALID;
}

/**
 * Get a detailed validation result object
 * @param contentId The content ID to validate
 * @returns Full validation result object
 */
export function getContentIdValidationDetails(contentId: string | null | undefined): ContentIdValidationResult {
  const resultType = getContentIdValidationResult(contentId);
  
  switch (resultType) {
    case ContentIdValidationResultType.VALID:
      return {
        isValid: true,
        message: null,
        resultType
      };
    case ContentIdValidationResultType.TEMPORARY:
      return {
        isValid: true,
        message: "This is a temporary content ID. Save the content to get a permanent ID.",
        resultType
      };
    case ContentIdValidationResultType.MISSING:
      return {
        isValid: false,
        message: "No content ID provided.",
        resultType
      };
    case ContentIdValidationResultType.INVALID:
      return {
        isValid: false,
        message: "The provided content ID is invalid.",
        resultType
      };
  }
}

/**
 * Normalizes a content ID
 * @param contentId The content ID to normalize
 * @returns Normalized content ID or null if invalid
 */
export function normalizeContentId(contentId: string | null | undefined): string | null {
  if (!contentId) return null;
  
  contentId = contentId.trim();
  
  // Return as-is if it's a valid UUID or temp ID
  if (isValidContentId(contentId)) {
    return contentId;
  }
  
  return null;
}
