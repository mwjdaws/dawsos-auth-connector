
/**
 * Types and validation functions for tag operations
 */

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

export interface TagValidationOptions {
  minLength?: number;
  maxLength?: number;
  maxTags?: number;
  allowDuplicates?: boolean;
  allowedPatterns?: RegExp[];
  disallowedPatterns?: RegExp[];
}

const DEFAULT_OPTIONS: TagValidationOptions = {
  minLength: 2,
  maxLength: 50,
  maxTags: 20,
  allowDuplicates: false
};

/**
 * Validates a single tag
 * 
 * @param tag The tag to validate
 * @param options Validation options
 * @returns ValidationResult with isValid and message
 */
export function validateTag(tag: string, options?: TagValidationOptions): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (!tag || typeof tag !== 'string') {
    return {
      isValid: false,
      message: "Tag cannot be empty"
    };
  }
  
  const trimmedTag = tag.trim();
  
  if (trimmedTag.length < (opts.minLength || 2)) {
    return {
      isValid: false,
      message: `Tag must be at least ${opts.minLength || 2} characters long`
    };
  }
  
  if (trimmedTag.length > (opts.maxLength || 50)) {
    return {
      isValid: false,
      message: `Tag must be no more than ${opts.maxLength || 50} characters long`
    };
  }
  
  // Check against allowed patterns
  if (opts.allowedPatterns && opts.allowedPatterns.length > 0) {
    const matchesAnyPattern = opts.allowedPatterns.some(pattern => pattern.test(trimmedTag));
    if (!matchesAnyPattern) {
      return {
        isValid: false,
        message: "Tag contains disallowed characters"
      };
    }
  }
  
  // Check against disallowed patterns
  if (opts.disallowedPatterns && opts.disallowedPatterns.length > 0) {
    const matchesAnyPattern = opts.disallowedPatterns.some(pattern => pattern.test(trimmedTag));
    if (matchesAnyPattern) {
      return {
        isValid: false,
        message: "Tag contains disallowed characters"
      };
    }
  }
  
  return {
    isValid: true,
    message: null
  };
}

/**
 * Validates an array of tags
 * 
 * @param tags Array of tags to validate
 * @param options Validation options
 * @returns ValidationResult with isValid and message
 */
export function validateTags(tags: string[], options?: TagValidationOptions): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (!Array.isArray(tags)) {
    return {
      isValid: false,
      message: "Tags must be an array"
    };
  }
  
  if (tags.length === 0) {
    return {
      isValid: true,
      message: null
    };
  }
  
  if (tags.length > (opts.maxTags || 20)) {
    return {
      isValid: false,
      message: `Cannot have more than ${opts.maxTags || 20} tags`
    };
  }
  
  // Check for duplicates
  if (!opts.allowDuplicates) {
    const uniqueTags = new Set(tags.map(tag => tag.trim().toLowerCase()));
    if (uniqueTags.size !== tags.length) {
      return {
        isValid: false,
        message: "Duplicate tags are not allowed"
      };
    }
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
    message: null
  };
}
