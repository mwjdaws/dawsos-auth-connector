
import { ValidationResult } from './types';

/**
 * Validates a document's required fields
 */
export function validateDocument(title: string, content?: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    message: null,
    errorMessage: null
  };
  
  // Title validation
  if (!title || !title.trim()) {
    result.isValid = false;
    result.message = 'Title is required';
    result.errorMessage = result.message;
    return result;
  }
  
  // Content validation (if required)
  if (content === undefined || content === null) {
    result.isValid = false;
    result.message = 'Content is required';
    result.errorMessage = result.message;
    return result;
  }
  
  return result;
}

/**
 * Validates a document for saving
 */
export function validateDocumentForSave(title: string): ValidationResult {
  return validateDocument(title);
}
