
import { ValidationResult, TagValidationOptions, VALIDATION_RESULTS } from './types';

/**
 * Validates a single tag
 * 
 * @param tag - The tag text to validate
 * @param options - Optional validation options
 * @returns Validation result object
 */
export function validateTag(tag: string, options?: TagValidationOptions): ValidationResult {
  if (!tag || typeof tag !== 'string') {
    return {
      isValid: false,
      errorMessage: "Tag cannot be empty"
    };
  }

  const trimmedTag = tag.trim();
  
  if (trimmedTag.length === 0) {
    return {
      isValid: false,
      errorMessage: "Tag cannot be empty"
    };
  }

  // Check min length
  if (options?.minLength && trimmedTag.length < options.minLength) {
    return {
      isValid: false,
      errorMessage: `Tag must be at least ${options.minLength} characters`
    };
  }

  // Check max length
  if (options?.maxLength && trimmedTag.length > options.maxLength) {
    return {
      isValid: false,
      errorMessage: `Tag cannot exceed ${options.maxLength} characters`
    };
  }

  // Default: tag is valid
  return VALIDATION_RESULTS.VALID;
}

/**
 * Validates an array of tags
 * 
 * @param tags - Array of tag strings to validate
 * @param options - Optional validation options
 * @returns Validation result object
 */
export function validateTags(tags: string[], options?: TagValidationOptions): ValidationResult {
  // No tags is valid by default, but can be configured with options
  if (!tags || tags.length === 0) {
    if (options?.allowEmpty === false) {
      return {
        isValid: false,
        errorMessage: "At least one tag is required"
      };
    }
    return VALIDATION_RESULTS.VALID;
  }

  // Check each tag
  for (let i = 0; i < tags.length; i++) {
    const result = validateTag(tags[i], options);
    if (!result.isValid) {
      return {
        isValid: false,
        errorMessage: `Tag ${i + 1}: ${result.errorMessage}`
      };
    }
  }

  // Check duplicates if not allowed
  if (options?.allowDuplicates === false) {
    const uniqueTags = new Set(tags.map(tag => tag.trim().toLowerCase()));
    if (uniqueTags.size !== tags.length) {
      return {
        isValid: false,
        errorMessage: "Duplicate tags are not allowed"
      };
    }
  }

  // Default: all tags are valid
  return VALIDATION_RESULTS.VALID;
}

/**
 * Check if a tag is valid
 * 
 * @param tag - The tag to check
 * @param options - Optional validation options
 * @returns Whether the tag is valid
 */
export function isValidTag(tag: string, options?: TagValidationOptions): boolean {
  return validateTag(tag, options).isValid;
}

/**
 * Check if tags are valid
 * 
 * @param tags - The tags to check
 * @param options - Optional validation options
 * @returns Whether the tags are valid
 */
export function areValidTags(tags: string[], options?: TagValidationOptions): boolean {
  return validateTags(tags, options).isValid;
}
