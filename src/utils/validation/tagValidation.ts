
import type { ValidationResult, TagValidationOptions } from './types';

// Default validation options
const defaultTagOptions: TagValidationOptions = {
  allowEmpty: false,
  maxTags: 20,
  minLength: 2,
  maxLength: 50
};

/**
 * Validates a single tag
 * @param tag The tag to validate
 * @param options Validation options
 * @returns A validation result
 */
export function validateTag(tag: string, options: TagValidationOptions = {}): ValidationResult {
  const opts = { ...defaultTagOptions, ...options };
  
  if (!tag || tag.trim() === '') {
    return {
      isValid: opts.allowEmpty === true,
      message: opts.allowEmpty ? null : 'Tag cannot be empty',
      errorCode: opts.allowEmpty ? null : 'TAG_EMPTY',
      errorMessage: opts.allowEmpty ? null : 'Tag cannot be empty' // Added for compatibility
    };
  }
  
  const trimmedTag = tag.trim();
  
  if (trimmedTag.length < (opts.minLength || 2)) {
    return {
      isValid: false,
      message: `Tag must be at least ${opts.minLength} characters`,
      errorCode: 'TAG_TOO_SHORT',
      errorMessage: `Tag must be at least ${opts.minLength} characters` // Added for compatibility
    };
  }
  
  if (trimmedTag.length > (opts.maxLength || 50)) {
    return {
      isValid: false,
      message: `Tag cannot exceed ${opts.maxLength} characters`,
      errorCode: 'TAG_TOO_LONG',
      errorMessage: `Tag cannot exceed ${opts.maxLength} characters` // Added for compatibility
    };
  }
  
  // Check for invalid characters
  if (!/^[a-zA-Z0-9\s_\-.:]+$/.test(trimmedTag)) {
    return {
      isValid: false,
      message: 'Tag contains invalid characters',
      errorCode: 'TAG_INVALID_CHARS',
      errorMessage: 'Tag contains invalid characters' // Added for compatibility
    };
  }
  
  return {
    isValid: true,
    message: null,
    errorCode: null,
    errorMessage: null // Added for compatibility
  };
}

/**
 * Validates a list of tags
 * @param tags The tags to validate
 * @param options Validation options
 * @returns A validation result
 */
export function validateTags(tags: string[], options: TagValidationOptions = {}): ValidationResult {
  const opts = { ...defaultTagOptions, ...options };
  
  if (!tags || tags.length === 0) {
    return {
      isValid: opts.allowEmpty === true,
      message: opts.allowEmpty ? null : 'At least one tag is required',
      errorCode: opts.allowEmpty ? null : 'TAGS_EMPTY',
      errorMessage: opts.allowEmpty ? null : 'At least one tag is required' // Added for compatibility
    };
  }
  
  if (tags.length > (opts.maxTags || 20)) {
    return {
      isValid: false,
      message: `Cannot exceed ${opts.maxTags} tags`,
      errorCode: 'TOO_MANY_TAGS',
      errorMessage: `Cannot exceed ${opts.maxTags} tags` // Added for compatibility
    };
  }
  
  // Validate each tag
  for (const tag of tags) {
    const tagValidation = validateTag(tag, opts);
    if (!tagValidation.isValid) {
      return tagValidation;
    }
  }
  
  // Check for duplicates
  const uniqueTags = new Set(tags.map(tag => tag.trim().toLowerCase()));
  if (uniqueTags.size !== tags.length) {
    return {
      isValid: false,
      message: 'Duplicate tags are not allowed',
      errorCode: 'DUPLICATE_TAGS',
      errorMessage: 'Duplicate tags are not allowed' // Added for compatibility
    };
  }
  
  return {
    isValid: true,
    message: null,
    errorCode: null,
    errorMessage: null // Added for compatibility
  };
}

/**
 * Validates tag positions for reordering
 * @param tagPositions Array of tag positions
 * @returns Validation result
 */
export function validateTagPositions(tagPositions: Array<{ id: string; position: number }>): ValidationResult {
  if (!tagPositions || tagPositions.length === 0) {
    return {
      isValid: false,
      message: 'No tag positions provided',
      errorCode: 'NO_TAG_POSITIONS',
      errorMessage: 'No tag positions provided' // Added for compatibility
    };
  }
  
  // Check for required fields
  for (const tagPos of tagPositions) {
    if (!tagPos.id) {
      return {
        isValid: false,
        message: 'Tag ID is required',
        errorCode: 'TAG_ID_REQUIRED',
        errorMessage: 'Tag ID is required' // Added for compatibility
      };
    }
    
    if (typeof tagPos.position !== 'number') {
      return {
        isValid: false, 
        message: 'Position must be a number',
        errorCode: 'POSITION_NOT_NUMBER',
        errorMessage: 'Position must be a number' // Added for compatibility
      };
    }
  }
  
  return {
    isValid: true,
    message: null,
    errorCode: null,
    errorMessage: null // Added for compatibility
  };
}
