
/**
 * Validation utilities
 * 
 * Common validation functions used across the application.
 */

import { 
  DocumentValidationOptions, 
  DocumentValidationResult, 
  TagValidationOptions, 
  TagValidationResult,
  ValidationResult,
  ContentIdValidationResult,
  ContentIdValidationResultType
} from './types';

// Re-export types
export type { 
  DocumentValidationOptions, 
  DocumentValidationResult, 
  TagValidationOptions, 
  TagValidationResult,
  ValidationResult,
  ContentIdValidationResult
};

export { ContentIdValidationResultType };

/**
 * Validates a document title
 */
export function validateDocumentTitle(
  title: string,
  options?: DocumentValidationOptions
): ValidationResult {
  const opts = {
    minLength: 1,
    maxLength: 255,
    ...options
  };

  if (!title || title.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: 'Title is required'
    };
  }

  if (title.length < opts.minLength) {
    return {
      isValid: false,
      errorMessage: `Title must be at least ${opts.minLength} characters`
    };
  }

  if (title.length > opts.maxLength) {
    return {
      isValid: false,
      errorMessage: `Title must be at most ${opts.maxLength} characters`
    };
  }

  return {
    isValid: true,
    errorMessage: null
  };
}

/**
 * Validates document content
 */
export function validateDocumentContent(
  content: string,
  options?: DocumentValidationOptions
): ValidationResult {
  const opts = {
    minLength: 0,
    maxLength: 1000000,
    ...options
  };

  if (opts.contentRequired && (!content || content.trim().length === 0)) {
    return {
      isValid: false,
      errorMessage: 'Content is required'
    };
  }

  if (content && content.length > opts.maxLength) {
    return {
      isValid: false,
      errorMessage: `Content must be at most ${opts.maxLength} characters`
    };
  }

  return {
    isValid: true,
    errorMessage: null
  };
}

/**
 * Validates a tag
 */
export function validateTag(
  tag: string,
  options?: TagValidationOptions
): ValidationResult {
  const opts = {
    minLength: 1,
    maxLength: 50,
    allowEmpty: false,
    ...options
  };

  if (!opts.allowEmpty && (!tag || tag.trim().length === 0)) {
    return {
      isValid: false,
      errorMessage: 'Tag is required'
    };
  }

  if (tag && tag.length < opts.minLength) {
    return {
      isValid: false,
      errorMessage: `Tag must be at least ${opts.minLength} characters`
    };
  }

  if (tag && tag.length > opts.maxLength) {
    return {
      isValid: false,
      errorMessage: `Tag must be at most ${opts.maxLength} characters`
    };
  }

  return {
    isValid: true,
    errorMessage: null
  };
}

/**
 * Validates a list of tags for duplicates
 */
export function validateTagsList(
  tags: string[],
  options?: TagValidationOptions
): ValidationResult {
  const opts = {
    allowDuplicates: false,
    ...options
  };

  if (!opts.allowDuplicates) {
    const uniqueTags = new Set(tags.map(t => t.toLowerCase()));
    if (uniqueTags.size !== tags.length) {
      return {
        isValid: false,
        errorMessage: 'Duplicate tags are not allowed'
      };
    }
  }

  return {
    isValid: true,
    errorMessage: null
  };
}
