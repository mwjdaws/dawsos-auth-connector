
import { ContentIdValidationResultType } from '@/utils/validation/types';

/**
 * Validates if a content ID is valid
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
 * Normalizes a content ID
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
