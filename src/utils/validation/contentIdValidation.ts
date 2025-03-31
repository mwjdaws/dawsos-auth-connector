
/**
 * Content ID validation utility functions
 * 
 * Provides utilities for validating content IDs, including format validation
 * and type checking (UUIDs vs temporary IDs)
 */
import { v4 as uuidv4, validate as validateUuid } from 'uuid';
import { ContentIdValidationResult } from './types';

/**
 * Validates whether a string is a valid content ID
 * 
 * @param contentId The ID to validate
 * @returns Whether the ID is valid
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  // Temp IDs are valid and start with "temp-"
  if (contentId.startsWith('temp-')) {
    return true;
  }
  
  // Otherwise, must be a valid UUID
  return validateUuid(contentId);
}

/**
 * Check if a content ID is a temporary ID
 * 
 * @param contentId The ID to check
 * @returns Whether the ID is a temporary ID
 */
export function isTempId(contentId: string): boolean {
  return contentId.startsWith('temp-');
}

/**
 * Check if a content ID is a UUID
 * 
 * @param contentId The ID to check
 * @returns Whether the ID is a UUID
 */
export function isUUID(contentId: string): boolean {
  return validateUuid(contentId);
}

/**
 * Attempts to convert a string to a UUID
 * If conversion fails, returns null
 * 
 * @param contentId The ID to convert
 * @returns A UUID if conversion succeeded, null otherwise
 */
export function tryConvertToUUID(contentId: string | null | undefined): string | null {
  if (!contentId) return null;
  
  // If it's already a UUID, return it
  if (validateUuid(contentId)) {
    return contentId;
  }
  
  // If it's a temp ID, try to extract a UUID from it
  if (contentId.startsWith('temp-') && contentId.length > 5) {
    const possibleUuid = contentId.substring(5);
    if (validateUuid(possibleUuid)) {
      return possibleUuid;
    }
  }
  
  return null;
}

/**
 * Checks if a content ID can be stored in the database
 * 
 * @param contentId The ID to check
 * @returns Whether the ID is storable (UUID only)
 */
export function isStorableContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  return validateUuid(contentId);
}

/**
 * Gets detailed validation information for a content ID
 * 
 * @param contentId The ID to validate
 * @returns Validation result with detailed information
 */
export function getContentIdValidationResult(contentId: string | null): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      isTemp: false,
      isUuid: false,
      errorMessage: 'Content ID is required'
    };
  }
  
  // Check for temporary content IDs (drafts, etc.)
  if (contentId.startsWith('temp-')) {
    return {
      isValid: true,
      isTemp: true,
      isUuid: false,
      errorMessage: null
    };
  }
  
  // Check for valid UUID
  if (validateUuid(contentId)) {
    return {
      isValid: true,
      isTemp: false,
      isUuid: true,
      errorMessage: null
    };
  }
  
  // Invalid ID format
  return {
    isValid: false,
    isTemp: false,
    isUuid: false,
    errorMessage: 'Invalid content ID format'
  };
}

/**
 * Generates a new temporary content ID
 * 
 * @returns A new temporary content ID
 */
export function generateTempContentId(): string {
  return `temp-${Date.now()}`;
}

/**
 * Generates a new UUID for content
 * 
 * @returns A new UUID
 */
export function generateContentId(): string {
  return uuidv4();
}
