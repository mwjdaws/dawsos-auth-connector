
import { ValidationResult, TagValidationOptions } from './types';

const DEFAULT_OPTIONS: TagValidationOptions = {
  allowEmpty: false,
  maxTags: 50,
  minLength: 1,
  maxLength: 50
};

/**
 * Validate tags
 * @param tags Array of tag strings to validate
 * @param options Optional validation options
 * @returns ValidationResult with validity and message
 */
export function validateTags(tags: string[], options?: TagValidationOptions): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (!tags || !Array.isArray(tags)) {
    return {
      isValid: false,
      message: 'Tags must be an array'
    };
  }

  if (!opts.allowEmpty && tags.length === 0) {
    return {
      isValid: false,
      message: 'At least one tag is required'
    };
  }

  if (opts.maxTags && tags.length > opts.maxTags) {
    return {
      isValid: false,
      message: `Maximum of ${opts.maxTags} tags allowed`
    };
  }

  // Check individual tags
  for (const tag of tags) {
    if (!tag || typeof tag !== 'string') {
      return {
        isValid: false,
        message: 'All tags must be valid strings'
      };
    }

    const trimmedTag = tag.trim();
    if (opts.minLength && trimmedTag.length < opts.minLength) {
      return {
        isValid: false,
        message: `Tags must be at least ${opts.minLength} characters long`
      };
    }

    if (opts.maxLength && trimmedTag.length > opts.maxLength) {
      return {
        isValid: false,
        message: `Tags must be less than ${opts.maxLength} characters long`
      };
    }
  }

  return {
    isValid: true,
    message: null
  };
}
