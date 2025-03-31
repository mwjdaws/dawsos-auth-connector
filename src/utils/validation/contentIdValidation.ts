
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';
import { createContentIdValidationResult } from './compatibility';

/**
 * Validates if a string is a valid content ID
 * @param contentId The content ID to validate
 * @returns True if the content ID is valid
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  
  // UUID format check
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isUuid = uuidPattern.test(contentId);
  
  // Temporary ID format check
  const isTempId = contentId.startsWith('temp-');
  
  return isUuid || isTempId;
}

/**
 * Gets more detailed validation result for a content ID
 * @param contentId The content ID to validate
 * @returns A validation result object with type information
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return createContentIdValidationResult(
      ContentIdValidationResultType.INVALID,
      false,
      'Content ID is required'
    );
  }
  
  // UUID format check
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(contentId)) {
    return createContentIdValidationResult(
      ContentIdValidationResultType.UUID,
      true,
      null
    );
  }
  
  // Temporary ID format check
  if (contentId.startsWith('temp-')) {
    return createContentIdValidationResult(
      ContentIdValidationResultType.TEMP,
      true,
      null
    );
  }
  
  // String ID format check (for backward compatibility)
  if (typeof contentId === 'string' && contentId.trim().length > 0) {
    return createContentIdValidationResult(
      ContentIdValidationResultType.STRING,
      true,
      null
    );
  }
  
  // Invalid format
  return createContentIdValidationResult(
    ContentIdValidationResultType.INVALID,
    false,
    'Invalid content ID format'
  );
}

/**
 * Simple validation that only returns a boolean result
 * @param contentId The content ID to validate
 * @returns True if valid, false otherwise
 */
export function validateContentId(contentId?: string | null): boolean {
  return isValidContentId(contentId);
}
