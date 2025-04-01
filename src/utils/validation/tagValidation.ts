
/**
 * Tag validation utility functions
 */
import { TagValidationResult } from './types';

// Validation options
export interface TagValidationOptions {
  minLength?: number;
  maxLength?: number;
  allowSpecialChars?: boolean;
  reservedWords?: string[];
}

/**
 * Default validation options
 */
const defaultOptions: TagValidationOptions = {
  minLength: 2,
  maxLength: 50,
  allowSpecialChars: true,
  reservedWords: []
};

/**
 * Validates a tag name
 * 
 * @param tagName Tag name to validate
 * @param options Optional validation options
 * @returns TagValidationResult with validation details
 */
export function validateTag(
  tagName: string,
  options?: Partial<TagValidationOptions>
): TagValidationResult {
  // Merge options with defaults
  const opts = { ...defaultOptions, ...options };
  
  // Check if tag is empty
  if (!tagName || !tagName.trim()) {
    return {
      isValid: false,
      errorMessage: "Tag name cannot be empty",
      resultType: "tag"
    };
  }
  
  // Check minimum length
  if (tagName.length < opts.minLength!) {
    return {
      isValid: false,
      errorMessage: `Tag must be at least ${opts.minLength} characters`,
      resultType: "tag"
    };
  }
  
  // Check maximum length
  if (tagName.length > opts.maxLength!) {
    return {
      isValid: false,
      errorMessage: `Tag cannot exceed ${opts.maxLength} characters`,
      resultType: "tag"
    };
  }
  
  // Check for reserved words
  if (opts.reservedWords && opts.reservedWords.includes(tagName.toLowerCase())) {
    return {
      isValid: false,
      errorMessage: `"${tagName}" is a reserved word and cannot be used as a tag`,
      resultType: "tag"
    };
  }
  
  // Check for special characters if not allowed
  if (!opts.allowSpecialChars && !/^[\w\s-]+$/.test(tagName)) {
    return {
      isValid: false,
      errorMessage: "Tag can only contain letters, numbers, spaces, and hyphens",
      resultType: "tag"
    };
  }
  
  // All validation passed
  return {
    isValid: true,
    errorMessage: null,
    resultType: "tag"
  };
}

/**
 * Checks if a collection of tags contains a specific tag (case-insensitive)
 * 
 * @param tagName Tag name to check
 * @param existingTags Array of existing tag names
 * @returns True if tag exists, false otherwise
 */
export function tagExistsInCollection(
  tagName: string,
  existingTags: string[]
): boolean {
  if (!tagName || !existingTags || !existingTags.length) {
    return false;
  }
  
  const normalizedTagName = tagName.trim().toLowerCase();
  return existingTags.some(tag => tag.toLowerCase() === normalizedTagName);
}
