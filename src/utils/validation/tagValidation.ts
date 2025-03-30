
import { ValidationResult, TagValidationOptions } from './types';

/**
 * Validates a single tag
 */
export function validateTag(tag: string, options?: TagValidationOptions): ValidationResult {
  const defaultOptions: Required<TagValidationOptions> = {
    maxLength: 50,
    minLength: 1,
    allowedChars: /^[a-zA-Z0-9\-_\s]+$/,
    allowEmpty: false
  };
  
  const opts = { ...defaultOptions, ...options };
  
  // Handle empty tags
  if (!tag.trim()) {
    if (opts.allowEmpty) {
      return { isValid: true, message: null };
    }
    return { 
      isValid: false, 
      message: 'Tag cannot be empty',
      errorMessage: 'Tag cannot be empty'
    };
  }
  
  // Check length
  if (tag.length > opts.maxLength) {
    return { 
      isValid: false, 
      message: `Tag must be ${opts.maxLength} characters or less`,
      errorMessage: `Tag must be ${opts.maxLength} characters or less`
    };
  }
  
  if (tag.length < opts.minLength) {
    return { 
      isValid: false, 
      message: `Tag must be at least ${opts.minLength} characters`,
      errorMessage: `Tag must be at least ${opts.minLength} characters`
    };
  }
  
  // Check allowed characters
  if (!opts.allowedChars.test(tag)) {
    return { 
      isValid: false, 
      message: 'Tag contains invalid characters',
      errorMessage: 'Tag contains invalid characters'
    };
  }
  
  return { isValid: true, message: null };
}

/**
 * Validates a list of tags
 */
export function validateTagList(tags: string[], options?: TagValidationOptions): ValidationResult {
  if (!tags.length) {
    return { isValid: true, message: null };
  }
  
  for (const tag of tags) {
    const result = validateTag(tag, options);
    if (!result.isValid) {
      return result;
    }
  }
  
  return { isValid: true, message: null };
}
