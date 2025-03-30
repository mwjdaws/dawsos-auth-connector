
import { DocumentValidationResult } from './types';

/**
 * Validates document title
 * @param title Document title to validate
 * @returns Validation result
 */
export function validateDocument(title: string, content?: string): DocumentValidationResult {
  if (!title || title.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Title is required',
      type: 'title'
    };
  }

  if (title.length > 255) {
    return {
      isValid: false,
      errorMessage: 'Title must be less than 255 characters',
      type: 'title'
    };
  }

  if (content && content.length > 100000) {
    return {
      isValid: false,
      errorMessage: 'Content is too long (max 100,000 characters)',
      type: 'content'
    };
  }

  return {
    isValid: true,
    errorMessage: null,
    type: 'title'
  };
}

/**
 * Validates document content
 * @param content Document content to validate
 * @returns Validation result
 */
export function validateContent(content: string): DocumentValidationResult {
  if (!content || content.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Content cannot be empty',
      type: 'content'
    };
  }

  if (content.length > 100000) {
    return {
      isValid: false,
      errorMessage: 'Content is too long (max 100,000 characters)',
      type: 'content'
    };
  }

  return {
    isValid: true,
    errorMessage: null,
    type: 'content'
  };
}
