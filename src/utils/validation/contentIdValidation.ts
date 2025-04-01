
/**
 * Content ID validation utilities
 */
import { 
  ValidationResult,
  ContentIdValidationResult 
} from './types';

/**
 * Validation result type constants
 */
export enum ContentIdValidationType {
  VALID = 'VALID',   // Valid content ID that exists
  TEMP = 'TEMP',     // Valid temporary content ID
  INVALID = 'INVALID' // Invalid content ID
}

/**
 * Checks if a content ID is in valid UUID format
 */
export function isValidUUID(id: string | null | undefined): boolean {
  if (!id) return false;
  
  // UUID v4 regex pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
}

/**
 * Checks if a string is a valid temporary content ID
 */
export function isValidTempContentId(id: string | null | undefined): boolean {
  if (!id) return false;
  
  return id.startsWith('temp-');
}

/**
 * Tries to convert a string to UUID format if possible
 */
export function tryConvertToUUID(id: string | null | undefined): string | null {
  if (!id) return null;
  if (isValidUUID(id)) return id;
  
  // Try to extract a UUID if it's embedded somewhere
  const uuidMatch = id.match(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  return uuidMatch ? uuidMatch[0] : null;
}

/**
 * Checks if a content ID is valid (either UUID or temporary)
 */
export function isValidContentId(id: string | null | undefined): boolean {
  if (!id) return false;
  
  return isValidUUID(id) || isValidTempContentId(id);
}

/**
 * Checks if a content ID can be stored in the database
 */
export function isStorableContentId(id: string | null | undefined): boolean {
  if (!id) return false;
  
  return isValidUUID(id);
}

/**
 * Creates a content ID validation result
 */
export function validateContentId(id: string | null | undefined): ContentIdValidationResult {
  if (!id) {
    return {
      isValid: false,
      resultType: ContentIdValidationType.INVALID,
      message: null,
      errorMessage: 'Content ID is required',
      contentExists: false
    };
  }
  
  if (isValidUUID(id)) {
    return {
      isValid: true,
      resultType: ContentIdValidationType.VALID,
      message: 'Valid UUID format',
      errorMessage: null,
      contentExists: false // This is set later by content checking
    };
  }
  
  if (isValidTempContentId(id)) {
    return {
      isValid: true,
      resultType: ContentIdValidationType.TEMP,
      message: 'Valid temporary ID',
      errorMessage: null,
      contentExists: false
    };
  }
  
  return {
    isValid: false,
    resultType: ContentIdValidationType.INVALID,
    message: null,
    errorMessage: 'Invalid content ID format',
    contentExists: false
  };
}

/**
 * Gets validation result for a content ID with additional checks
 */
export function getContentIdValidationResult(
  id: string | null | undefined,
  exists: boolean = false
): ContentIdValidationResult {
  const result = validateContentId(id);
  
  if (exists) {
    result.contentExists = true;
    result.message = 'Content exists';
  }
  
  return result;
}
