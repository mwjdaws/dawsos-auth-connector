
/**
 * Content ID validation utility functions
 */
import { ContentIdValidationResult } from './types';

/**
 * Regular expression to validate UUIDs
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Checks if a string is a valid UUID
 * 
 * @param str String to check
 * @returns True if valid UUID, false otherwise
 */
export function isUuid(str: string): boolean {
  return UUID_REGEX.test(str);
}

/**
 * Checks if a string is a temporary ID (starting with "temp-")
 * 
 * @param str String to check
 * @returns True if valid temp ID, false otherwise
 */
export function isTempId(str: string): boolean {
  return str.startsWith('temp-') && str.length > 5;
}

/**
 * Validates that a content ID is either a valid UUID or a temporary ID
 * 
 * @param contentId Content ID to validate
 * @returns True if valid content ID, false otherwise
 */
export function isValidContentId(contentId: string): boolean {
  if (!contentId) return false;
  return isUuid(contentId) || isTempId(contentId);
}

/**
 * Validates a content ID with additional information
 * 
 * @param contentId The content ID to validate
 * @returns ContentIdValidationResult with validation details
 */
export function validateContentId(contentId: string): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      contentExists: false,
      errorMessage: "Content ID is required",
      resultType: "contentId"
    };
  }
  
  if (!isValidContentId(contentId)) {
    return {
      isValid: false,
      contentExists: false,
      errorMessage: "Invalid content ID format",
      resultType: "contentId"
    };
  }
  
  return {
    isValid: true,
    contentExists: null,
    errorMessage: null,
    resultType: "contentId"
  };
}

/**
 * Attempts to convert a string to a UUID, handling various formats
 * 
 * @param value String to convert
 * @returns UUID if convertible, null otherwise
 */
export function tryConvertToUUID(value: string): string | null {
  // If it's already a valid UUID, return it
  if (isUuid(value)) {
    return value;
  }
  
  // Handle UUIDs without hyphens
  if (/^[0-9a-f]{32}$/i.test(value)) {
    const parts = [
      value.slice(0, 8),
      value.slice(8, 12),
      value.slice(12, 16),
      value.slice(16, 20),
      value.slice(20)
    ];
    const uuid = parts.join('-');
    if (isUuid(uuid)) {
      return uuid;
    }
  }
  
  return null;
}
