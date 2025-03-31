
/**
 * Tag validation utilities
 * 
 * Provides functions for validating tag data
 */

import { ValidationResult } from './types';
import { Tag } from '@/types/tag';

/**
 * Validate a tag name
 * 
 * @param tagName The tag name to validate
 * @returns Validation result with isValid flag and any error messages
 */
export function validateTagName(tagName: string): ValidationResult {
  if (!tagName || tagName.trim() === '') {
    return {
      isValid: false,
      message: null,
      errorMessage: 'Tag name cannot be empty'
    };
  }

  if (tagName.trim().length < 2) {
    return {
      isValid: false,
      message: null,
      errorMessage: 'Tag name must be at least 2 characters long'
    };
  }

  if (tagName.trim().length > 50) {
    return {
      isValid: false,
      message: null,
      errorMessage: 'Tag name cannot exceed 50 characters'
    };
  }

  // Check for invalid characters
  if (/[^\w\s\-\.]/i.test(tagName)) {
    return {
      isValid: false,
      message: null,
      errorMessage: 'Tag name contains invalid characters'
    };
  }

  return {
    isValid: true,
    message: 'Tag name is valid',
    errorMessage: null
  };
}

/**
 * Check if a tag already exists in a collection
 * 
 * @param tagName The tag name to check
 * @param existingTags Collection of existing tags
 * @returns Validation result with isValid flag and any error messages
 */
export function validateTagUniqueness(tagName: string, existingTags: Tag[]): ValidationResult {
  if (!existingTags || !Array.isArray(existingTags)) {
    return {
      isValid: true,
      message: 'No existing tags to check against',
      errorMessage: null
    };
  }

  const normalizedNewTag = tagName.trim().toLowerCase();
  const tagExists = existingTags.some(tag => 
    tag.name.trim().toLowerCase() === normalizedNewTag
  );

  if (tagExists) {
    return {
      isValid: false,
      message: null,
      errorMessage: `Tag "${tagName}" already exists`
    };
  }

  return {
    isValid: true,
    message: 'Tag is unique',
    errorMessage: null
  };
}

/**
 * Comprehensive tag validation
 * 
 * @param tagName The tag name to validate
 * @param existingTags Optional collection of existing tags to check uniqueness
 * @returns Validation result with isValid flag and any error messages
 */
export function validateTag(tagName: string, existingTags?: Tag[]): ValidationResult {
  // First validate the tag name format
  const nameValidation = validateTagName(tagName);
  if (!nameValidation.isValid) {
    return nameValidation;
  }

  // Then check for uniqueness if existing tags are provided
  if (existingTags) {
    const uniquenessValidation = validateTagUniqueness(tagName, existingTags);
    if (!uniquenessValidation.isValid) {
      return uniquenessValidation;
    }
  }

  return {
    isValid: true,
    message: 'Tag is valid',
    errorMessage: null
  };
}
