
import { ValidationResult, TagValidationOptions } from './types';
import { createValidationResult } from './compatibility';

/**
 * Validates a single tag
 * 
 * @param tag The tag to validate
 * @param options Optional validation options
 */
export function validateTag(
  tag: string,
  options?: TagValidationOptions
): ValidationResult {
  // Basic handling for empty tags
  if (!tag || !tag.trim()) {
    // Check if empty tags are allowed
    if (options?.allowEmpty) {
      return createValidationResult(true, null);
    }
    return createValidationResult(false, "Tag cannot be empty");
  }
  
  // Check min length
  const minLength = options?.minLength ?? 1; // Default to 1 if not specified
  if (tag.length < minLength) {
    return createValidationResult(
      false, 
      `Tag must be at least ${minLength} characters`
    );
  }
  
  // Check max length
  const maxLength = options?.maxLength ?? 50; // Default to 50 if not specified
  if (tag.length > maxLength) {
    return createValidationResult(
      false, 
      `Tag cannot exceed ${maxLength} characters`
    );
  }
  
  // Check for special characters
  const allowSpecialChars = options?.allowSpecialChars ?? false;
  if (!allowSpecialChars) {
    const specialCharsPattern = /[^a-zA-Z0-9\s-_]/;
    if (specialCharsPattern.test(tag)) {
      return createValidationResult(
        false, 
        "Tag contains invalid special characters"
      );
    }
  }
  
  // Tag is valid
  return createValidationResult(true, null);
}

/**
 * Validates multiple tags
 * 
 * @param tags Array of tags to validate
 * @param options Optional validation options
 * @returns ValidationResult for the entire set of tags
 */
export function validateTags(
  tags: string[],
  options?: TagValidationOptions
): ValidationResult {
  // Handle empty tag array
  if (!tags || tags.length === 0) {
    return createValidationResult(true, null);
  }
  
  // Validate each tag
  for (const tag of tags) {
    const result = validateTag(tag, options);
    if (!result.isValid) {
      return result;
    }
  }
  
  // All tags are valid
  return createValidationResult(true, null);
}
