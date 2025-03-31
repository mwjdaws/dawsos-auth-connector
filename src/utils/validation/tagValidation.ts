
import { ValidationResult, TagValidationOptions } from './types';
import { createValidationResult, VALIDATION_RESULTS } from './compatibility';

/**
 * Default validation options for tags
 */
const DEFAULT_TAG_OPTIONS: Required<TagValidationOptions> = {
  maxLength: 50,
  minLength: 1,
  allowSpecialChars: false,
  allowEmpty: false
};

/**
 * Validates a single tag
 * 
 * @param tag - The tag string to validate
 * @param options - Optional validation options to customize the validation rules
 * @returns ValidationResult indicating if the tag is valid and any error message
 */
export function validateTag(tag: string, options?: TagValidationOptions): ValidationResult {
  // Apply default options
  const opts = { ...DEFAULT_TAG_OPTIONS, ...options };
  
  // Check if tag is null or undefined
  if (tag === undefined || tag === null) {
    return opts.allowEmpty
      ? VALIDATION_RESULTS.VALID
      : VALIDATION_RESULTS.REQUIRED;
  }
  
  // Check if tag is empty
  if (tag.trim() === '') {
    return opts.allowEmpty
      ? VALIDATION_RESULTS.VALID
      : VALIDATION_RESULTS.REQUIRED;
  }
  
  // Check minimum length
  if (opts.minLength !== null && tag.length < opts.minLength) {
    return createValidationResult(
      false,
      `Tag must be at least ${opts.minLength} character${opts.minLength !== 1 ? 's' : ''} long`
    );
  }
  
  // Check maximum length
  if (opts.maxLength !== null && tag.length > opts.maxLength) {
    return createValidationResult(
      false,
      `Tag must be ${opts.maxLength} character${opts.maxLength !== 1 ? 's' : ''} or less`
    );
  }
  
  // Check for special characters if not allowed
  if (!opts.allowSpecialChars) {
    const specialCharsRegex = /[^a-zA-Z0-9\s-_]/;
    if (specialCharsRegex.test(tag)) {
      return createValidationResult(
        false,
        'Tag contains invalid characters (only letters, numbers, spaces, hyphens, and underscores are allowed)'
      );
    }
  }
  
  return VALIDATION_RESULTS.VALID;
}

/**
 * Validates an array of tags
 * 
 * @param tags - Array of tag strings to validate
 * @param options - Optional validation options to customize the validation rules
 * @returns ValidationResult indicating if all tags are valid and any error message
 */
export function validateTags(tags: string[], options?: TagValidationOptions): ValidationResult {
  // Handle empty tag array
  if (!tags || tags.length === 0) {
    return options?.allowEmpty === false
      ? createValidationResult(false, 'At least one tag is required')
      : VALIDATION_RESULTS.VALID;
  }
  
  // Validate each tag
  for (const tag of tags) {
    const result = validateTag(tag, options);
    if (!result.isValid) {
      return result;
    }
  }
  
  return VALIDATION_RESULTS.VALID;
}
