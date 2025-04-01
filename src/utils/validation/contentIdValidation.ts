
/**
 * Content ID Validation Utilities
 */
import { validate as validateUUID } from 'uuid';

/**
 * Check if a string is a valid UUID
 */
export function isUUID(str: string): boolean {
  return validateUUID(str);
}

/**
 * Check if a content ID is valid (either a UUID or a temporary ID starting with 'temp-')
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  return isUUID(contentId) || contentId.startsWith('temp-');
}

/**
 * Check if a content ID is storable (is a UUID and not a temporary ID)
 */
export function isStorableContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  return isUUID(contentId);
}

/**
 * Try to convert a string to a UUID, returning null if invalid
 */
export function tryConvertToUUID(str: string): string | null {
  return isUUID(str) ? str : null;
}

/**
 * Try to parse a content ID as a UUID, returning null if not a UUID
 */
export function tryParseContentIdAsUUID(contentId: string | null | undefined): string | null {
  if (!contentId) return null;
  return isUUID(contentId) ? contentId : null;
}

/**
 * Create result for content ID validation
 */
export function createContentIdValidationResult(
  isValid: boolean,
  errorMessage: string | null = null,
  contentExists: boolean = false
) {
  return {
    isValid,
    errorMessage,
    contentExists,
    message: errorMessage,
    resultType: 'contentId'
  };
}

/**
 * Content ID validation result type
 */
export interface ContentIdValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  contentExists: boolean;
  message: string | null;
  resultType: string;
}
