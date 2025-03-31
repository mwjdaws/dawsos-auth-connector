
import { ValidationResult } from './types';
import { TagValidationOptions } from './types';
import { createValidationResult } from './compatibility';

/**
 * Basic validation for a single tag name
 */
export function validateTag(tag: string, options: TagValidationOptions = {}): ValidationResult {
  const {
    maxLength = 50,
    minLength = 1,
    allowSpecialChars = false
  } = options;

  // Empty tag check
  if (!tag || tag.trim().length === 0) {
    return createValidationResult(false, 'Tag cannot be empty');
  }
  
  // Length checks
  if (minLength !== null && tag.length < minLength) {
    return createValidationResult(
      false, 
      `Tag must be at least ${minLength} character${minLength === 1 ? '' : 's'}`
    );
  }
  
  if (maxLength !== null && tag.length > maxLength) {
    return createValidationResult(
      false, 
      `Tag must be ${maxLength} characters or less`
    );
  }
  
  // Special characters check
  if (!allowSpecialChars) {
    const specialCharsPattern = /[^\w\s-]/;
    if (specialCharsPattern.test(tag)) {
      return createValidationResult(
        false, 
        'Tag contains invalid special characters'
      );
    }
  }
  
  return createValidationResult(true, null);
}

/**
 * Validate a list of tags
 */
export function validateTags(tags: string[], options?: TagValidationOptions): ValidationResult {
  if (!tags || !Array.isArray(tags)) {
    return createValidationResult(false, 'Invalid tags array');
  }
  
  for (const tag of tags) {
    const result = validateTag(tag, options);
    if (!result.isValid) {
      return result;
    }
  }
  
  return createValidationResult(true, null);
}
