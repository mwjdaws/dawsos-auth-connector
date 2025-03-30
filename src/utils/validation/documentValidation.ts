
import type { ValidationResult } from './types';

/**
 * Validates a document title
 * @param title The title to validate
 * @returns A validation result
 */
export function validateDocumentTitle(title: string): ValidationResult {
  if (!title || title.trim() === '') {
    return {
      isValid: false,
      message: 'Title is required',
      errorCode: 'TITLE_REQUIRED',
      errorMessage: 'Title is required' // Added for compatibility
    };
  }
  
  if (title.length > 255) {
    return {
      isValid: false,
      message: 'Title must be 255 characters or less',
      errorCode: 'TITLE_TOO_LONG',
      errorMessage: 'Title must be 255 characters or less' // Added for compatibility
    };
  }
  
  return {
    isValid: true,
    message: null,
    errorCode: null,
    errorMessage: null // Added for compatibility
  };
}

/**
 * Validates a document for saving
 * @param title The document title
 * @returns A validation result
 */
export function validateDocumentForSave(title: string): ValidationResult {
  return validateDocumentTitle(title);
}

/**
 * Validates a document for publishing
 * @param title The document title
 * @param content The document content
 * @returns A validation result
 */
export function validateDocumentForPublish(title: string, content: string): ValidationResult {
  const titleValidation = validateDocumentTitle(title);
  if (!titleValidation.isValid) {
    return titleValidation;
  }
  
  if (!content || content.trim() === '') {
    return {
      isValid: false,
      message: 'Content cannot be empty',
      errorCode: 'CONTENT_EMPTY',
      errorMessage: 'Content cannot be empty' // Added for compatibility
    };
  }
  
  return {
    isValid: true,
    message: null,
    errorCode: null,
    errorMessage: null // Added for compatibility
  };
}
