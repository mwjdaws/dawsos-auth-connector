
/**
 * Tag Validation Utilities
 * 
 * Contains validation functions for tags to ensure consistent rules
 * are applied throughout the application.
 */

/**
 * Validation options for tag validation
 */
export interface TagValidationOptions {
  minTagLength?: number;
  maxTagLength?: number;
  maxNumTags?: number;
  allowSpecialChars?: boolean;
}

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Default validation options
 */
const DEFAULT_OPTIONS: TagValidationOptions = {
  minTagLength: 2,
  maxTagLength: 30,
  maxNumTags: 20,
  allowSpecialChars: false
};

/**
 * Validates a single tag against the provided options
 * 
 * @param tag - The tag to validate
 * @param options - Optional validation constraints
 * @returns A validation result object
 */
export function validateTag(tag: string, options?: TagValidationOptions): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Check if tag is empty
  if (!tag || !tag.trim()) {
    return {
      isValid: false,
      message: 'Tag cannot be empty'
    };
  }
  
  // Check minimum length
  if (tag.trim().length < (opts.minTagLength || 2)) {
    return {
      isValid: false,
      message: `Tag must be at least ${opts.minTagLength} characters long`
    };
  }
  
  // Check maximum length
  if (tag.trim().length > (opts.maxTagLength || 30)) {
    return {
      isValid: false,
      message: `Tag cannot be longer than ${opts.maxTagLength} characters`
    };
  }
  
  // Check for special characters
  if (!opts.allowSpecialChars) {
    const specialCharsRegex = /[^\w\s-]/gi;
    if (specialCharsRegex.test(tag)) {
      return {
        isValid: false,
        message: 'Tag contains invalid characters'
      };
    }
  }
  
  return {
    isValid: true,
    message: ''
  };
}

/**
 * Validates an array of tags against the provided options
 * 
 * @param tags - The array of tags to validate
 * @param options - Optional validation constraints
 * @returns A validation result object
 */
export function validateTags(tags: string[], options?: TagValidationOptions): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Check maximum number of tags
  if (tags.length > (opts.maxNumTags || 20)) {
    return {
      isValid: false,
      message: `Cannot have more than ${opts.maxNumTags} tags`
    };
  }
  
  // Validate each individual tag
  for (const tag of tags) {
    const result = validateTag(tag, opts);
    if (!result.isValid) {
      return result;
    }
  }
  
  return {
    isValid: true,
    message: ''
  };
}
