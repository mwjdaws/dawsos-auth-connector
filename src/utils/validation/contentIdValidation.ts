
import { ContentIdValidationResultType, ValidationResult } from './types';

/**
 * Determines the validation status of a content ID
 */
export function getContentIdValidationResult(id: string | null | undefined): ValidationResult & { type: ContentIdValidationResultType } {
  if (id === null || id === undefined || id.trim() === '') {
    return {
      type: ContentIdValidationResultType.INVALID,
      isValid: false,
      message: 'Content ID is required',
      errorMessage: 'Content ID is required'
    };
  }

  // UUID pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // Temporary ID pattern
  const tempPattern = /^temp-/i;

  // Format is UUID
  if (uuidPattern.test(id)) {
    return {
      type: ContentIdValidationResultType.UUID,
      isValid: true,
      message: null,
      errorMessage: null
    };
  }
  
  // Format is temporary ID
  if (tempPattern.test(id)) {
    return {
      type: ContentIdValidationResultType.TEMP,
      isValid: true,
      message: 'Temporary content ID',
      errorMessage: null
    };
  }
  
  // Format is string ID
  if (id.length > 0) {
    return {
      type: ContentIdValidationResultType.STRING,
      isValid: true,
      message: null,
      errorMessage: null
    };
  }

  // Invalid ID
  return {
    type: ContentIdValidationResultType.INVALID,
    isValid: false,
    message: 'Invalid content ID format',
    errorMessage: 'Invalid content ID format'
  };
}

/**
 * Simplified check to see if a content ID is valid
 */
export function isValidContentId(id: string | null | undefined): boolean {
  if (!id) return false;
  return getContentIdValidationResult(id).isValid;
}
