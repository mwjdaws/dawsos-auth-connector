
/**
 * Validation utilities
 * Compatibility layer for existing code
 */
import { 
  getContentIdValidationResult as getContentIdValidationResultInternal, 
  isValidContentId as isValidContentIdInternal, 
  tryConvertToUUID,
  isStorableContentId as isStorableContentIdInternal
} from './validation/contentIdValidation';
import { ContentIdValidationResult } from './validation/types';

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Validates if a string is a valid content ID
 * Supports both UUID and temporary ID formats
 * 
 * @param contentId The content ID to validate
 * @returns True if the content ID is valid
 */
export function isValidContentId(contentId?: string | null): boolean {
  return isValidContentIdInternal(contentId);
}

/**
 * Gets a validation result for a content ID
 * 
 * @param contentId The content ID to validate
 * @returns A validation result object
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  const result = getContentIdValidationResultInternal(contentId);
  return {
    isValid: result.isValid,
    errorMessage: result.errorMessage,
    message: result.message,
    resultType: result.resultType
  };
}

/**
 * Attempts to convert a string to a UUID format
 * 
 * @param contentId The content ID to convert
 * @returns UUID string if conversion is successful, null otherwise
 */
export function tryConvertContentIdToUUID(contentId?: string | null): string | null {
  return tryConvertToUUID(contentId);
}

/**
 * Determines if a content ID is suitable for direct database storage
 * 
 * @param contentId The content ID to evaluate
 * @returns True if the ID is appropriate for database storage
 */
export function isStorableContentId(contentId?: string | null): boolean {
  return isStorableContentIdInternal(contentId);
}
