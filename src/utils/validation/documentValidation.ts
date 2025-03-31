
import { ValidationResult, DocumentValidationResult } from './types';

/**
 * Validates a document title
 */
export function validateDocumentTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: 'Title is required'
    };
  }
  
  if (title.length > 255) {
    return {
      isValid: false,
      errorMessage: 'Title cannot exceed 255 characters'
    };
  }
  
  return {
    isValid: true,
    errorMessage: null
  };
}

/**
 * Validates document content
 */
export function validateDocumentContent(content: string): ValidationResult {
  if (!content || content.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: 'Content is required'
    };
  }
  
  const contentLength = content.length;
  
  if (contentLength < 10) {
    return {
      isValid: false,
      errorMessage: 'Content is too short (minimum 10 characters)'
    };
  }
  
  if (contentLength > 100000) {
    return {
      isValid: false,
      errorMessage: 'Content is too long (maximum 100,000 characters)'
    };
  }
  
  return {
    isValid: true,
    errorMessage: null
  };
}

/**
 * Validates a complete document
 */
export function validateDocument(title: string, content: string): DocumentValidationResult {
  const titleValidation = validateDocumentTitle(title);
  if (!titleValidation.isValid) {
    return {
      ...titleValidation,
      isPublishable: false
    };
  }
  
  const contentValidation = validateDocumentContent(content);
  if (!contentValidation.isValid) {
    return {
      ...contentValidation,
      isPublishable: false
    };
  }
  
  // Document is valid and publishable
  return {
    isValid: true,
    errorMessage: null,
    isPublishable: true
  };
}
