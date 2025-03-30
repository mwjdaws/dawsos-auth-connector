
/**
 * Standard validation result interface
 * 
 * @property isValid Whether the validation passed
 * @property message Error message if validation failed, null otherwise
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Options for tag validation
 */
export interface TagValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowSpecialChars?: boolean;
  allowDuplicates?: boolean;
}

/**
 * Validates a single tag name
 * 
 * @param tag The tag name to validate
 * @param options Validation options
 * @returns ValidationResult with isValid and message
 */
export function validateTag(tag: string, options: TagValidationOptions = {}): ValidationResult {
  const maxLength = options.maxLength || 50;
  const minLength = options.minLength || 1;
  const allowSpecialChars = options.allowSpecialChars || false;
  
  if (!tag || typeof tag !== 'string') {
    return {
      isValid: false,
      message: "Tag must be a non-empty string"
    };
  }
  
  const tag_trimmed = tag.trim();
  
  if (tag_trimmed.length < minLength) {
    return {
      isValid: false,
      message: `Tag must be at least ${minLength} character${minLength === 1 ? '' : 's'} long`
    };
  }
  
  if (tag_trimmed.length > maxLength) {
    return {
      isValid: false,
      message: `Tag must be no more than ${maxLength} characters long`
    };
  }
  
  if (!allowSpecialChars && !/^[a-zA-Z0-9\s-_]+$/.test(tag_trimmed)) {
    return {
      isValid: false,
      message: "Tag contains invalid characters"
    };
  }
  
  return {
    isValid: true,
    message: null
  };
}

/**
 * Validates an array of tags
 * 
 * @param tags Array of tag names to validate
 * @param options Validation options
 * @returns ValidationResult with isValid and message
 */
export function validateTags(tags: string[], options: TagValidationOptions = {}): ValidationResult {
  if (!Array.isArray(tags)) {
    return {
      isValid: false,
      message: "Tags must be provided as an array"
    };
  }
  
  if (tags.length === 0) {
    return {
      isValid: true,
      message: null
    };
  }
  
  // Validate each individual tag
  for (const tag of tags) {
    const tagResult = validateTag(tag, options);
    if (!tagResult.isValid) {
      return tagResult;
    }
  }
  
  // Check for duplicates if not allowed
  if (!options.allowDuplicates) {
    const lowerCaseTags = tags.map(tag => tag.toLowerCase().trim());
    const uniqueTags = new Set(lowerCaseTags);
    
    if (uniqueTags.size !== lowerCaseTags.length) {
      return {
        isValid: false,
        message: "Duplicate tags are not allowed"
      };
    }
  }
  
  return {
    isValid: true,
    message: null
  };
}
