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
