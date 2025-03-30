
import { ValidationError } from '../errors/types';
import { handleError } from '../errors';

/**
 * Standard validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a single tag
 * 
 * @param tag The tag to validate
 * @returns True if valid, false otherwise
 */
export function validateTag(tag: string): boolean {
  // Check if tag exists and is a non-empty string
  if (!tag || typeof tag !== 'string' || tag.trim() === '') {
    return false;
  }
  
  // Check for invalid formatting
  if (tag.startsWith('```') || 
      tag.startsWith('"') || 
      tag.endsWith('"')) {
    return false;
  }
  
  return true;
}

/**
 * Validates an array of tags
 * 
 * @param tags Array of tag strings to validate
 * @param reportErrors Whether to report errors using handleError
 * @returns Validation result with isValid flag and array of error messages
 */
export function validateTags(tags: string[], reportErrors = true): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: []
  };
  
  // Check for empty tags array
  if (!tags?.length) {
    result.isValid = false;
    result.errors.push("No tags provided");
    
    if (reportErrors) {
      handleError(
        new ValidationError("No tags provided"),
        "No tags to save"
      );
    }
    
    return result;
  }
  
  // Validate individual tags and collect invalid ones
  const invalidTags = new Set<string>();
  for (const tag of tags) {
    if (!validateTag(tag)) {
      invalidTags.add(tag || 'empty');
    }
  }
  
  // Report validation errors if any invalid tags were found
  if (invalidTags.size > 0) {
    result.isValid = false;
    const errorMessage = `Found ${invalidTags.size} invalid tags`;
    result.errors.push(errorMessage);
    
    if (reportErrors) {
      handleError(
        new ValidationError(errorMessage),
        "Some tags are invalid and cannot be saved"
      );
    }
  }
  
  return result;
}
