
import { ValidationResult } from './tagValidation';

/**
 * Validates a document title
 * 
 * @param title The document title to validate
 * @returns ValidationResult with isValid and message
 */
export function validateDocumentTitle(title: string): ValidationResult {
  if (!title || typeof title !== 'string') {
    return {
      isValid: false,
      message: "Title is required"
    };
  }
  
  const titleTrimmed = title.trim();
  
  if (titleTrimmed.length < 3) {
    return {
      isValid: false,
      message: "Title must be at least 3 characters long"
    };
  }
  
  if (titleTrimmed.length > 255) {
    return {
      isValid: false,
      message: "Title must be no more than 255 characters long"
    };
  }
  
  return {
    isValid: true,
    message: null
  };
}
