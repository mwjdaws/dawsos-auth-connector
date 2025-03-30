
import { ValidationResult, TagValidationOptions } from './types';

/**
 * Validates a list of tags against validation options
 */
export function validateTags(
  tags: string[],
  options: TagValidationOptions = {}
): ValidationResult {
  const {
    allowEmpty = true,
    minLength = 1,
    maxLength = 50,
    maxTags = 100,
    allowDuplicates = false,
    pattern
  } = options;

  // Check if empty tags are allowed
  if (!allowEmpty && tags.length === 0) {
    return {
      isValid: false,
      errorMessage: 'At least one tag is required',
      message: 'At least one tag is required'
    };
  }

  // Check maximum number of tags
  if (tags.length > maxTags) {
    return {
      isValid: false,
      errorMessage: `Maximum of ${maxTags} tags allowed`,
      message: `Maximum of ${maxTags} tags allowed`
    };
  }

  // Check for duplicates
  if (!allowDuplicates) {
    const uniqueTags = new Set(tags);
    if (uniqueTags.size !== tags.length) {
      return {
        isValid: false,
        errorMessage: 'Duplicate tags are not allowed',
        message: 'Duplicate tags are not allowed'
      };
    }
  }

  // Validate individual tags
  for (const tag of tags) {
    // Check length
    if (tag.length < minLength) {
      return {
        isValid: false,
        errorMessage: `Tags must be at least ${minLength} characters`,
        message: `Tags must be at least ${minLength} characters`
      };
    }

    if (tag.length > maxLength) {
      return {
        isValid: false,
        errorMessage: `Tags must be no more than ${maxLength} characters`,
        message: `Tags must be no more than ${maxLength} characters`
      };
    }

    // Check pattern if specified
    if (pattern && !pattern.test(tag)) {
      return {
        isValid: false,
        errorMessage: 'Tag contains invalid characters',
        message: 'Tag contains invalid characters'
      };
    }
  }

  return {
    isValid: true,
    errorMessage: null,
    message: null
  };
}
