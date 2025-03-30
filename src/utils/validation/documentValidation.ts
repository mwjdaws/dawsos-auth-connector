
import { ValidationResult } from './types';

/**
 * Validates a document title
 * @deprecated Use validateDocument instead
 */
export function validateDocumentTitle(title: string): ValidationResult {
  return validateDocument(title);
}

/**
 * Validates a document
 */
export function validateDocument(title: string): ValidationResult {
  if (!title || title.trim() === '') {
    return {
      isValid: false,
      message: 'Document title is required',
      errorMessage: 'Document title is required'
    };
  }
  
  if (title.length < 3) {
    return {
      isValid: false,
      message: 'Document title must be at least 3 characters',
      errorMessage: 'Document title must be at least 3 characters'
    };
  }
  
  if (title.length > 255) {
    return {
      isValid: false,
      message: 'Document title cannot exceed 255 characters',
      errorMessage: 'Document title cannot exceed 255 characters'
    };
  }
  
  return {
    isValid: true,
    message: null
  };
}
