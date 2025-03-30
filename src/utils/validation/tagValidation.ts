
import { ValidationResult, TagValidationOptions } from './types';

/**
 * Default tag validation options
 */
const defaultTagOptions: TagValidationOptions = {
  minLength: 2,
  maxLength: 50,
  allowedChars: /^[a-zA-Z0-9\-_\s]+$/,
  allowEmpty: false
};

/**
 * Validates a single tag
 */
export function validateTag(tag: string, options: TagValidationOptions = {}): ValidationResult {
  const opts = { ...defaultTagOptions, ...options };
  
  if (!tag && !opts.allowEmpty) {
    return {
      isValid: false,
      message: 'Tag cannot be empty',
      errorMessage: 'Tag cannot be empty'
    };
  }
  
  if (tag.length < opts.minLength!) {
    return {
      isValid: false,
      message: `Tag must be at least ${opts.minLength} characters`,
      errorMessage: `Tag must be at least ${opts.minLength} characters`
    };
  }
  
  if (tag.length > opts.maxLength!) {
    return {
      isValid: false,
      message: `Tag cannot exceed ${opts.maxLength} characters`,
      errorMessage: `Tag cannot exceed ${opts.maxLength} characters`
    };
  }
  
  if (!opts.allowedChars!.test(tag)) {
    return {
      isValid: false,
      message: 'Tag contains invalid characters',
      errorMessage: 'Tag contains invalid characters'
    };
  }
  
  return {
    isValid: true,
    message: null
  };
}

/**
 * For backward compatibility with code that expects validateTags
 */
export function validateTags(tags: string[], options: TagValidationOptions = {}): ValidationResult {
  if (!tags || tags.length === 0) {
    return {
      isValid: true,
      message: null
    };
  }
  
  for (const tag of tags) {
    const result = validateTag(tag, options);
    if (!result.isValid) {
      return result;
    }
  }
  
  return {
    isValid: true,
    message: null
  };
}
