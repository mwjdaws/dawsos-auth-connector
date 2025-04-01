
import { v4 as uuidv4, validate as validateUUID } from 'uuid';
import { ContentIdValidationResult, createContentIdValidationResult } from './types';

/**
 * Check if a string is a valid UUID
 */
export function isUUID(id: string | null | undefined): boolean {
  if (!id) return false;
  return validateUUID(id);
}

/**
 * Check if a string is a temporary ID (starts with 'temp-')
 */
export function isTempId(id: string | null | undefined): boolean {
  if (!id) return false;
  return id.startsWith('temp-');
}

/**
 * Checks if a string is a valid content ID format (either UUID or temp-)
 */
export function isValidContentId(id: string | null | undefined): boolean {
  if (!id) return false;
  return isUUID(id) || isTempId(id);
}

/**
 * Validate a content ID
 */
export function validateContentId(id: string | null | undefined): ContentIdValidationResult {
  // Empty ID check
  if (!id) {
    return createContentIdValidationResult(
      false,
      'INVALID',
      null,
      'Content ID is required',
      false
    );
  }
  
  // Temporary ID check
  if (isTempId(id)) {
    return createContentIdValidationResult(
      true,
      'TEMP',
      'Valid temporary ID',
      null,
      false
    );
  }
  
  // UUID validation
  if (!isUUID(id)) {
    return createContentIdValidationResult(
      false,
      'INVALID',
      null,
      'Invalid content ID format',
      false
    );
  }
  
  // Valid UUID
  return createContentIdValidationResult(
    true,
    'VALID',
    'Valid content ID',
    null,
    true  // We assume content exists if it's a valid UUID
  );
}
