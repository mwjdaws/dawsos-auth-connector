
import { ValidationResult } from './types';

/**
 * Validates a document based on its title and content
 */
export function validateDocument(title: string, content: string): ValidationResult {
  // Validate title
  if (!title || title.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Title is required',
      message: 'Title is required'
    };
  }
  
  if (title.length > 255) {
    return {
      isValid: false,
      errorMessage: 'Title cannot exceed 255 characters',
      message: 'Title cannot exceed 255 characters'
    };
  }
  
  // Validate content
  if (!content || content.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Content is required',
      message: 'Content is required'
    };
  }
  
  // All validation checks passed
  return {
    isValid: true,
    errorMessage: null,
    message: null
  };
}

/**
 * Determines if a document can be published
 */
export function canPublishDocument(title: string, content: string): ValidationResult {
  const baseValidation = validateDocument(title, content);
  
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  
  // Additional publishing criteria
  if (content.length < 50) {
    return {
      isValid: false,
      errorMessage: 'Content must be at least 50 characters to publish',
      message: 'Content must be at least 50 characters to publish'
    };
  }
  
  return {
    isValid: true,
    errorMessage: null,
    message: null
  };
}
