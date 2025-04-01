
import { TagValidationResult } from './types';

/**
 * Tag validation options
 */
export interface TagValidationOptions {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  pattern?: RegExp;
  blacklist?: string[];
}

/**
 * Default validation options
 */
const defaultOptions: TagValidationOptions = {
  minLength: 1,
  maxLength: 50,
  required: true,
  pattern: /^[A-Za-z0-9\s-_]+$/,
  blacklist: []
};

/**
 * Validate a tag against provided options
 * 
 * @param tag Tag string to validate
 * @param options Validation options
 * @returns TagValidationResult with validation status and error message
 */
export function validateTag(
  tag: string,
  options?: Partial<TagValidationOptions>
): TagValidationResult {
  const mergedOptions = { ...defaultOptions, ...options };
  
  const {
    minLength,
    maxLength,
    required,
    pattern,
    blacklist
  } = mergedOptions;
  
  // Check if tag is required but empty
  if (required && (!tag || tag.trim() === '')) {
    return { 
      isValid: false, 
      errorMessage: 'Tag name is required',
      resultType: 'tag'
    };
  }
  
  // Skip other validations if tag is empty and not required
  if (!tag || tag.trim() === '') {
    return { 
      isValid: true, 
      errorMessage: null,
      resultType: 'tag'
    };
  }
  
  // Check min length
  if (minLength !== undefined && tag.trim().length < minLength) {
    return { 
      isValid: false, 
      errorMessage: `Tag must be at least ${minLength} characters long`,
      resultType: 'tag'
    };
  }
  
  // Check max length
  if (maxLength !== undefined && tag.trim().length > maxLength) {
    return { 
      isValid: false, 
      errorMessage: `Tag must be no more than ${maxLength} characters long`,
      resultType: 'tag'
    };
  }
  
  // Check against pattern
  if (pattern && !pattern.test(tag)) {
    return { 
      isValid: false, 
      errorMessage: 'Tag contains invalid characters',
      resultType: 'tag'
    };
  }
  
  // Check against blacklist
  if (blacklist && blacklist.includes(tag.toLowerCase())) {
    return { 
      isValid: false, 
      errorMessage: 'This tag is not allowed',
      resultType: 'tag'
    };
  }
  
  return { 
    isValid: true, 
    errorMessage: null,
    resultType: 'tag'
  };
}
