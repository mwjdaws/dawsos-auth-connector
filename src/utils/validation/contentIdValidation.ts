
/**
 * Content ID validation utilities
 * 
 * Functions for validating content IDs in various formats
 */

// Regular expression for UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Prefix for temporary IDs
const TEMP_ID_PREFIX = 'temp-';

/**
 * Check if a string is a valid UUID
 * 
 * @param value String to check
 * @returns True if the string is a valid UUID
 */
export function isUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Check if a string is a temporary ID
 * 
 * @param value String to check
 * @returns True if the string is a temporary ID
 */
export function isTempId(value: string): boolean {
  return value.startsWith(TEMP_ID_PREFIX) && value.length > TEMP_ID_PREFIX.length;
}

/**
 * Check if a value is a valid content ID (either UUID or temporary ID)
 * 
 * @param value Value to check
 * @returns True if the value is a valid content ID
 */
export function isValidContentId(value?: string | null): boolean {
  if (!value) return false;
  return isUUID(value) || isTempId(value);
}

/**
 * Generate a new temporary ID
 * 
 * @returns A new temporary ID
 */
export function generateTempId(): string {
  return `${TEMP_ID_PREFIX}${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult {
  isValid: boolean;
  isTemp: boolean;
  isUuid: boolean;
  errorMessage: string | null;
}

/**
 * Get detailed validation information for a content ID
 * 
 * @param value Content ID to validate
 * @returns Validation result with detailed information
 */
export function getContentIdValidationResult(value?: string | null): ContentIdValidationResult {
  if (!value) {
    return {
      isValid: false,
      isTemp: false,
      isUuid: false,
      errorMessage: 'Content ID is missing or undefined'
    };
  }

  const validUuid = isUUID(value);
  const validTemp = isTempId(value);
  const isValid = validUuid || validTemp;

  if (!isValid) {
    return {
      isValid: false,
      isTemp: false,
      isUuid: false,
      errorMessage: 'Invalid content ID format'
    };
  }

  return {
    isValid: true,
    isTemp: validTemp,
    isUuid: validUuid,
    errorMessage: null
  };
}
