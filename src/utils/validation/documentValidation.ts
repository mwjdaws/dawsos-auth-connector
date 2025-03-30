
import { ValidationResult } from './types';

/**
 * Validate a document title
 * @param title The title to validate
 * @returns ValidationResult with validity and message
 */
export function validateDocumentTitle(title: string): ValidationResult {
  if (!title || title.trim() === '') {
    return {
      isValid: false,
      message: 'Title is required'
    };
  }

  if (title.length < 3) {
    return {
      isValid: false,
      message: 'Title must be at least 3 characters long'
    };
  }

  if (title.length > 200) {
    return {
      isValid: false,
      message: 'Title must be less than 200 characters'
    };
  }

  return {
    isValid: true,
    message: null
  };
}

/**
 * Validate a document for saving
 * @param title The document title
 * @returns ValidationResult with validity and message
 */
export function validateDocumentForSave(title: string): ValidationResult {
  return validateDocumentTitle(title);
}
