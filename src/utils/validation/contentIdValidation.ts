
import { ValidationResult, ContentIdValidationResultType } from './types';
import { createValidationResult, VALIDATION_RESULTS } from './compatibility';

/**
 * Validates if a string is a valid content ID
 * Supports UUID format or temporary IDs (temp_xxx)
 * 
 * @param contentId - The content ID to validate
 * @returns True if the content ID is valid
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
 * Validates a content ID and returns a detailed validation result
 * 
 * @param contentId - The content ID to validate
 * @returns A ValidationResult with validation details
 */
export function validateContentId(contentId: string | null | undefined): ValidationResult {
  if (!contentId) {
    return createValidationResult(false, "Content ID is required");
  }
  
  if (!isValidContentId(contentId)) {
    return createValidationResult(false, "Invalid content ID format");
  }
  
  return VALIDATION_RESULTS.VALID;
}

/**
 * Gets detailed validation result for a content ID
 * Provides the specific type of content ID (UUID, temporary, string)
 * 
 * @param contentId - The content ID to validate
 * @returns The validation result type
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
