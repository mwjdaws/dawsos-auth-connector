
/**
 * Tag validation utilities
 */
import { ValidationResult, TagValidationOptions } from './types';

/**
 * Minimum length for valid tag names
 */
const MIN_TAG_LENGTH = 2;

/**
 * Maximum length for valid tag names
 */
const MAX_TAG_LENGTH = 50;

/**
 * Validates a tag name
 */
export function validateTags(
  tagName: string,
  options?: TagValidationOptions
): ValidationResult {
  const minLength = options?.minLength || MIN_TAG_LENGTH;
  const maxLength = options?.maxLength || MAX_TAG_LENGTH;
  const allowSpecialChars = options?.allowSpecialChars || false;
  
  if (!tagName || !tagName.trim()) {
    return {
      isValid: false,
      errorMessage: 'Tag name is required',
      message: 'Tag name is required'
    };
  }
  
  if (tagName.length < minLength) {
    return {
      isValid: false,
      errorMessage: `Tag name must be at least ${minLength} characters`,
      message: `Tag name must be at least ${minLength} characters`
    };
  }
  
  if (tagName.length > maxLength) {
    return {
      isValid: false,
      errorMessage: `Tag name cannot exceed ${maxLength} characters`,
      message: `Tag name cannot exceed ${maxLength} characters`
    };
  }
  
  if (!allowSpecialChars) {
    // Check for special characters
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialCharsRegex.test(tagName)) {
      return {
        isValid: false,
        errorMessage: 'Tag name should not contain special characters',
        message: 'Tag name should not contain special characters'
      };
    }
  }
  
  // Check for spaces
  if (tagName.includes(' ')) {
    return {
      isValid: false,
      errorMessage: 'Tag name should not contain spaces',
      message: 'Tag name should not contain spaces'
    };
  }
  
  // All checks have passed
  return {
    isValid: true,
    errorMessage: null,
    message: null
  };
}
