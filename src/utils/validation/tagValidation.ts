
/**
 * Tag validation utilities
 * 
 * Functions for validating tags.
 */

import { TagValidationOptions, TagValidationResult } from './types';

/**
 * Validates a single tag
 */
export function validateTag(
  tag: string,
  options?: TagValidationOptions
): TagValidationResult {
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
): TagValidationResult {
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
