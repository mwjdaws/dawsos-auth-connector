
import { ValidationResult } from './types';
import { TagValidationOptions } from './index';

/**
 * Validates a list of tags
 * @param tags Array of tag strings to validate
 * @param options Optional validation configuration
 * @returns Object containing validation result and error message
 */
export function validateTags(tags: string[], options: TagValidationOptions = {}): ValidationResult {
  const {
    allowEmpty = true,
    maxTags = 50,
    minLength = 2,
    maxLength = 30
  } = options;

  // Check if tags are required but empty
  if (!allowEmpty && (!tags || tags.length === 0)) {
    return {
      isValid: false,
      message: "At least one tag is required"
    };
  }

  // Check if too many tags
  if (tags.length > maxTags) {
    return {
      isValid: false,
      message: `Cannot have more than ${maxTags} tags`
    };
  }

  // Check each tag's length and format
  const invalidTags = tags.filter(tag => {
    if (!tag || tag.trim().length < minLength) return true;
    if (tag.trim().length > maxLength) return true;
    
    // Special characters validation
    const invalidCharsRegex = /[^\w\s-]/; // Allow letters, numbers, spaces, hyphens
    return invalidCharsRegex.test(tag);
  });

  if (invalidTags.length > 0) {
    return {
      isValid: false,
      message: "Some tags have invalid format or length"
    };
  }

  // Check for duplicate tags (case insensitive)
  const lowerTags = tags.map(t => t.toLowerCase());
  if (new Set(lowerTags).size !== lowerTags.length) {
    return {
      isValid: false,
      message: "Duplicate tags are not allowed"
    };
  }

  return {
    isValid: true,
    message: null
  };
}
