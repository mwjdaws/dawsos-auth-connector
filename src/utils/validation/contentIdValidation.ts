
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

/**
 * Checks if a content ID is valid and not a temporary ID
 * @param contentId The content ID to validate
 * @returns True if the content ID is valid, false otherwise
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  // Check if it's a temporary ID (starts with 'temp-')
  if (contentId.startsWith('temp-')) return false;
  
  // Basic validation: should be a UUID or a valid string ID
  // UUID format: 8-4-4-4-12 hexadecimal digits
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  return uuidRegex.test(contentId);
}

/**
 * Gets detailed validation result for a content ID
 * @param contentId The content ID to validate
 * @returns A ContentIdValidationResultType enum value indicating the validation status
 */
export function getContentIdValidationResult(contentId: string | null | undefined): ContentIdValidationResultType {
  if (!contentId) return ContentIdValidationResultType.MISSING;
  if (contentId.startsWith('temp-')) return ContentIdValidationResultType.TEMPORARY;
  
  // UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(contentId)) return ContentIdValidationResultType.INVALID;
  
  return ContentIdValidationResultType.VALID;
}

/**
 * Validates the content ID and returns a normalized version
 * @param contentId The content ID to validate and normalize
 * @returns The normalized content ID or null if invalid
 */
export function normalizeContentId(contentId: string | null | undefined): string | null {
  if (!isValidContentId(contentId)) return null;
  return contentId;
}
