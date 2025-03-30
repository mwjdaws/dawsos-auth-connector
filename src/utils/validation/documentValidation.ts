
/**
 * Document validation utilities
 * 
 * Functions for validating document properties like titles, ensuring
 * they meet the application's requirements.
 */

import type { ValidationResult } from './tagValidation';

/**
 * Validates a document title
 * @param title Title to validate
 * @returns Object containing validation result and error message
 */
export const validateDocumentTitle = (title: string): ValidationResult => {
  // Check for empty title
  if (!title || !title.trim()) {
    return {
      isValid: false,
      message: "Please enter a title before saving"
    };
  }

  // Check for minimum length
  if (title.trim().length < 3) {
    return {
      isValid: false,
      message: "Title must be at least 3 characters long"
    };
  }

  // Check for maximum length
  if (title.trim().length > 100) {
    return {
      isValid: false,
      message: "Title cannot exceed 100 characters"
    };
  }

  // Check for invalid characters
  const invalidCharsRegex = /[<>{}[\]\\^~|]/;
  if (invalidCharsRegex.test(title)) {
    return {
      isValid: false,
      message: "Title contains invalid characters"
    };
  }

  return {
    isValid: true,
    message: ""
  };
};
