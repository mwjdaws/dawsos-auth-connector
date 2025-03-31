
import { ValidationResult, TagValidationOptions } from './types';
import { createValidationResult } from './compatibility';

const DEFAULT_TAG_OPTIONS: Required<TagValidationOptions> = {
  maxLength: 50,
  minLength: 1,
  allowSpecialChars: true,
  allowEmpty: true,
};

/**
 * Validates a tag string according to specified options
 */
export function validateTag(tag: string, options?: TagValidationOptions): ValidationResult {
  const opts = { ...DEFAULT_TAG_OPTIONS, ...options };
  
  // Empty tag validation
  if (!tag || !tag.trim()) {
    if (opts.allowEmpty) {
      return createValidationResult(true);
    }
    return createValidationResult(false, "Tag cannot be empty");
  }
  
  // Length validation
  if (opts.minLength && tag.trim().length < opts.minLength) {
    return createValidationResult(
      false, 
      `Tag must be at least ${opts.minLength} characters`
    );
  }
  
  if (opts.maxLength && tag.trim().length > opts.maxLength) {
    return createValidationResult(
      false, 
      `Tag must be ${opts.maxLength} characters or less`
    );
  }
  
  // Special character validation
  if (!opts.allowSpecialChars) {
    const specialCharsRegex = /[^a-zA-Z0-9-_\s]/;
    if (specialCharsRegex.test(tag)) {
      return createValidationResult(
        false, 
        "Tag contains special characters that are not allowed"
      );
    }
  }
  
  return createValidationResult(true);
}

/**
 * Validates an array of tags
 */
export function validateTags(tags: string[], options?: TagValidationOptions): ValidationResult {
  // No tags is valid by default, but can be configured with options
  if (!tags || tags.length === 0) {
    if (options?.allowEmpty === false) {
      return createValidationResult(false, "At least one tag is required");
    }
    return createValidationResult(true);
  }
  
  // Check each tag
  for (const tag of tags) {
    const result = validateTag(tag, options);
    if (!result.isValid) {
      return result;
    }
  }
  
  return createValidationResult(true);
}
