
import { ValidationResult, ContentIdValidationResult, TagValidationResult, createValidResult, createInvalidResult, createContentIdValidationResult } from './types';

/**
 * Ensure a value is a string, converting null/undefined to empty string
 */
export function ensureString(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  return String(value);
}

/**
 * Convert legacy validation results to the new format
 * This is used to maintain backward compatibility with older code
 */
export function convertValidationResult(
  result: { isValid: boolean; message?: string | null; errorMessage?: string | null } | null | undefined
): ValidationResult {
  if (!result) {
    return {
      isValid: false,
      errorMessage: 'No validation result provided',
      message: null,
      resultType: 'generic'
    };
  }

  return {
    isValid: Boolean(result.isValid),
    errorMessage: result.errorMessage || null,
    message: result.message || null,
    resultType: 'generic'
  };
}

/**
 * Convert legacy content ID validation results to the new format
 */
export function convertContentIdValidationResult(
  result: { isValid: boolean; message?: string | null; errorMessage?: string | null; contentExists?: boolean } | null | undefined
): ContentIdValidationResult {
  if (!result) {
    return {
      isValid: false,
      errorMessage: 'No validation result provided',
      message: null,
      contentExists: false,
      resultType: 'contentId'
    };
  }

  return {
    isValid: Boolean(result.isValid),
    errorMessage: result.errorMessage || null,
    message: result.message || null,
    contentExists: Boolean(result.contentExists),
    resultType: 'contentId'
  };
}

/**
 * Get content ID validation result in a consistent format
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return createContentIdValidationResult(false, 'Content ID is required');
  }
  
  // Basic format check (simplified)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(contentId);
  const isTempId = contentId.startsWith('temp-');
  
  if (!isUuid && !isTempId) {
    return createContentIdValidationResult(false, 'Invalid content ID format');
  }
  
  return createContentIdValidationResult(true, null, true);
}

/**
 * Legacy wrapper - use isValidContentId instead
 */
export function validateContentId(contentId?: string | null): ContentIdValidationResult {
  return getContentIdValidationResult(contentId);
}
