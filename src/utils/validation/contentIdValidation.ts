
/**
 * Content ID validation utilities
 * 
 * Functions for validating content IDs with support for both UUID and temporary IDs.
 */

import { ContentIdValidationResult } from './types';

// UUID regex pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TEMP_ID_PATTERN = /^temp-[\w-]+$/;

// Result type enum
export enum ContentIdValidationResultType {
  VALID = 'valid',
  INVALID = 'invalid', 
  UUID = 'uuid',
  TEMP = 'temp'
}

/**
 * Checks if a string is a valid UUID
 */
export function isUUID(id: string): boolean {
  return UUID_PATTERN.test(id);
}

/**
 * Checks if a string is a valid temporary ID
 */
export function isTempId(id: string): boolean {
  return TEMP_ID_PATTERN.test(id);
}

/**
 * Gets the validation result for a content ID
 * Supports both UUID and temporary IDs
 * 
 * @param contentId Content ID to validate
 * @returns Content ID validation result
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      resultType: 'invalid',
      message: 'Content ID is missing',
      errorMessage: 'Content ID is missing'
    };
  }
  
  if (isUUID(contentId)) {
    return {
      isValid: true,
      resultType: 'uuid',
      message: 'Valid UUID',
      errorMessage: null
    };
  }
  
  if (isTempId(contentId)) {
    return {
      isValid: true,
      resultType: 'temp',
      message: 'Valid temporary ID',
      errorMessage: null
    };
  }
  
  return {
    isValid: false,
    resultType: 'invalid',
    message: 'Invalid content ID format',
    errorMessage: 'Invalid content ID format'
  };
}

/**
 * Checks if a content ID is valid
 * Accepts both UUID and temporary IDs
 * 
 * @param contentId Content ID to validate
 * @returns True if the content ID is valid
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return isUUID(contentId) || isTempId(contentId);
}

/**
 * Attempts to convert a string to a UUID
 * 
 * @param contentId Content ID to convert
 * @returns UUID string if conversion is successful, null otherwise
 */
export function tryConvertToUUID(contentId?: string | null): string | null {
  if (!contentId) return null;
  
  // If already a UUID, return as is
  if (isUUID(contentId)) return contentId;
  
  try {
    // Attempt to normalize and convert to UUID format
    // Remove any non-alphanumeric characters
    const normalized = contentId.replace(/[^a-f0-9]/gi, '');
    
    // Check if we have enough characters for a UUID
    if (normalized.length >= 32) {
      const uuid = `${normalized.substring(0, 8)}-${normalized.substring(8, 12)}-${normalized.substring(12, 16)}-${normalized.substring(16, 20)}-${normalized.substring(20, 32)}`;
      
      if (isUUID(uuid)) {
        return uuid;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}
