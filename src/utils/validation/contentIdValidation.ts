
import { ContentIdValidationResultType } from './types';

/**
 * Validates if a string is a valid content ID
 * (either UUID or temporary ID)
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  // Check if UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(contentId)) {
    return true;
  }
  
  // Check if temporary ID (temp_xxx format)
  const tempIdRegex = /^temp_[a-zA-Z0-9-_]+$/;
  if (tempIdRegex.test(contentId)) {
    return true;
  }
  
  // Any non-empty string is considered valid for backward compatibility
  return contentId.trim() !== '';
}

/**
 * Gets detailed validation result for a content ID
 */
export function getContentIdValidationResult(contentId: string | null | undefined): ContentIdValidationResultType {
  if (!contentId) {
    return ContentIdValidationResultType.INVALID;
  }
  
  // Check if UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(contentId)) {
    return ContentIdValidationResultType.UUID;
  }
  
  // Check if temporary ID (temp_xxx format)
  const tempIdRegex = /^temp_[a-zA-Z0-9-_]+$/;
  if (tempIdRegex.test(contentId)) {
    return ContentIdValidationResultType.TEMP;
  }
  
  // Any non-empty string is considered valid
  if (contentId.trim() !== '') {
    return ContentIdValidationResultType.STRING;
  }
  
  return ContentIdValidationResultType.INVALID;
}
