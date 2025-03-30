
/**
 * Result of a validation operation
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

export interface TagValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowDuplicates?: boolean;
  allowSpaces?: boolean;
  blockedChars?: string[];
}

/**
 * Validates a single tag against the specified options
 */
export function validateTag(tag: string, options?: TagValidationOptions): ValidationResult {
  if (!tag || typeof tag !== 'string') {
    return {
      isValid: false,
      message: "Tag is required"
    };
  }
  
  const trimmedTag = tag.trim();
  const opts = {
    maxLength: options?.maxLength || 50,
    minLength: options?.minLength || 1,
    allowSpaces: options?.allowSpaces || false,
    blockedChars: options?.blockedChars || ['#', '%', '&', '{', '}', '\\', '<', '>', '*', '?', '/', '$', '!', "'", '"', ':', '@']
  };
  
  if (trimmedTag.length < opts.minLength) {
    return {
      isValid: false,
      message: `Tag must be at least ${opts.minLength} character${opts.minLength !== 1 ? 's' : ''} long`
    };
  }
  
  if (trimmedTag.length > opts.maxLength) {
    return {
      isValid: false,
      message: `Tag must be no more than ${opts.maxLength} characters long`
    };
  }
  
  if (!opts.allowSpaces && trimmedTag.includes(' ')) {
    return {
      isValid: false,
      message: "Tag cannot contain spaces"
    };
  }
  
  for (const char of opts.blockedChars) {
    if (trimmedTag.includes(char)) {
      return {
        isValid: false,
        message: `Tag cannot contain the character '${char}'`
      };
    }
  }
  
  return {
    isValid: true,
    message: null
  };
}

/**
 * Validates an array of tags against the specified options
 */
export function validateTags(tags: string[], options?: TagValidationOptions): ValidationResult {
  if (!Array.isArray(tags)) {
    return {
      isValid: false,
      message: "Tags must be an array"
    };
  }
  
  // Check for duplicates unless explicitly allowed
  if (options?.allowDuplicates !== true) {
    const uniqueTags = new Set(tags.map(tag => tag.toLowerCase().trim()));
    if (uniqueTags.size !== tags.length) {
      return {
        isValid: false,
        message: "Duplicate tags are not allowed"
      };
    }
  }
  
  // Validate each tag individually
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
