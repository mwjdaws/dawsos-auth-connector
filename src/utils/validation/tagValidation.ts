
/**
 * Validation utilities for tags
 */
import { TagValidationOptions, ValidationResult } from './types';
import { createValidationResult } from './types';
import { ensureString } from './compatibility';

/**
 * Validates a tag against the specified options
 * @param tag The tag to validate
 * @param options Validation options
 * @returns A validation result
 */
export function validateTag(
  tag: string, 
  options: TagValidationOptions = {}
): ValidationResult {
  const {
    minLength = 1,
    maxLength = 50,
    allowEmpty = false,
    allowSpecialChars = true
  } = options;
  
  // Handle empty tags
  if (!tag || tag.trim().length === 0) {
    return createValidationResult(
      allowEmpty,
      allowEmpty ? null : "Tag cannot be empty"
    );
  }
  
  // Check length
  if (tag.trim().length < minLength) {
    return createValidationResult(
      false,
      `Tag must be at least ${minLength} characters`
    );
  }
  
  if (tag.length > maxLength) {
    return createValidationResult(
      false,
      `Tag cannot exceed ${maxLength} characters`
    );
  }
  
  // Check for special characters
  if (!allowSpecialChars && !/^[a-zA-Z0-9\s\-_]+$/.test(tag)) {
    return createValidationResult(
      false,
      "Tag contains invalid characters"
    );
  }
  
  return createValidationResult(true, null);
}

/**
 * Validates a list of tags
 * @param tags The tags to validate
 * @param options Validation options
 * @returns A validation result
 */
export function validateTags(
  tags: string[],
  options: TagValidationOptions = {}
): ValidationResult {
  const { allowDuplicates = false } = options;
  
  // Check for duplicates
  if (!allowDuplicates) {
    const uniqueTags = new Set(tags.map(tag => tag.trim().toLowerCase()));
    if (uniqueTags.size !== tags.length) {
      return createValidationResult(
        false,
        "Duplicate tags are not allowed"
      );
    }
  }
  
  // Validate each tag
  for (const tag of tags) {
    const result = validateTag(tag, options);
    if (!result.isValid) {
      return result;
    }
  }
  
  return createValidationResult(true, null);
}

/**
 * Checks if a tag is valid
 * @param tag The tag to validate
 * @param options Validation options
 * @returns True if the tag is valid
 */
export function isValidTag(
  tag: string | undefined | null,
  options: TagValidationOptions = {}
): boolean {
  const safeTag = ensureString(tag);
  return validateTag(safeTag, options).isValid;
}

/**
 * Checks if all tags in a list are valid
 * @param tags The tags to validate
 * @param options Validation options
 * @returns True if all tags are valid
 */
export function areValidTags(
  tags: (string | undefined | null)[],
  options: TagValidationOptions = {}
): boolean {
  const safeTags = tags.map(tag => ensureString(tag));
  return validateTags(safeTags, options).isValid;
}
