
/**
 * Tag validation utilities
 * 
 * Functions for validating tag names, uniqueness, and formats.
 */

import { ValidationResult } from './types';
import { createValidResult, createInvalidResult } from './utils';
import { Tag } from '@/types/tag';

/**
 * Validates a tag name based on a set of rules
 * 
 * @param tagName The tag name to validate
 * @param options Validation options
 * @returns Validation result
 */
export function validateTagName(
  tagName: string,
  options: {
    minLength?: number;
    maxLength?: number;
    disallowSpecialChars?: boolean;
  } = {}
): ValidationResult {
  const {
    minLength = 1,
    maxLength = 50,
    disallowSpecialChars = true
  } = options;
  
  // Check if tag is empty
  if (!tagName || tagName.trim() === '') {
    return createInvalidResult('Tag name cannot be empty');
  }
  
  // Check length constraints
  if (tagName.length < minLength) {
    return createInvalidResult(`Tag must be at least ${minLength} characters long`);
  }
  
  if (tagName.length > maxLength) {
    return createInvalidResult(`Tag cannot exceed ${maxLength} characters`);
  }
  
  // Check for special characters if disallowed
  if (disallowSpecialChars && /[^\w\s-]/.test(tagName)) {
    return createInvalidResult('Tag contains invalid characters. Use only letters, numbers, spaces, and hyphens.');
  }
  
  return createValidResult();
}

/**
 * Validates that a tag name is unique among existing tags
 * 
 * @param tagName The tag name to check
 * @param existingTags Array of existing tags
 * @returns Validation result
 */
export function validateTagUniqueness(tagName: string, existingTags: Tag[]): ValidationResult {
  const normalizedName = tagName.trim().toLowerCase();
  
  if (existingTags.some(tag => tag.name.trim().toLowerCase() === normalizedName)) {
    return createInvalidResult('Tag already exists');
  }
  
  return createValidResult();
}

/**
 * Validates a tag name with combined rules
 * 
 * @param tagName The tag name to validate
 * @param existingTags Optional array of existing tags for uniqueness check
 * @returns Validation result
 */
export function validateTag(tagName: string, existingTags?: Tag[]): ValidationResult {
  // First check basic tag name validity
  const nameResult = validateTagName(tagName);
  if (!nameResult.isValid) {
    return nameResult;
  }
  
  // If existing tags are provided, check uniqueness
  if (existingTags) {
    const uniquenessResult = validateTagUniqueness(tagName, existingTags);
    if (!uniquenessResult.isValid) {
      return uniquenessResult;
    }
  }
  
  return createValidResult();
}
