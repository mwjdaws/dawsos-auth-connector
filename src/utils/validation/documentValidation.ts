
import { ValidationResult } from './types';

/**
 * Validates document title
 * @param title The document title to validate
 * @returns Validation result
 */
export function validateDocumentTitle(title: string): ValidationResult {
  if (!title || title.trim() === '') {
    return {
      isValid: false,
      message: "Title is required",
      errorCode: "DOC_TITLE_REQUIRED",
      errorMessage: "Title is required"
    };
  }

  if (title.length > 200) {
    return {
      isValid: false,
      message: "Title cannot exceed 200 characters",
      errorCode: "DOC_TITLE_TOO_LONG",
      errorMessage: "Title cannot exceed 200 characters"
    };
  }

  return {
    isValid: true,
    message: null,
    errorCode: null,
    errorMessage: null
  };
}

/**
 * Validates document for saving
 * @param title The document title
 * @param content The document content
 * @returns Validation result
 */
export function validateDocumentForSave(title: string, content?: string): ValidationResult {
  // Title is always required
  const titleValidation = validateDocumentTitle(title);
  if (!titleValidation.isValid) {
    return titleValidation;
  }

  // For saving, content can be empty
  return {
    isValid: true,
    message: null,
    errorCode: null,
    errorMessage: null
  };
}

/**
 * Validates document for publishing
 * @param title The document title
 * @param content The document content
 * @returns Validation result
 */
export function validateDocumentForPublish(title: string, content?: string): ValidationResult {
  // Title validation
  const titleValidation = validateDocumentTitle(title);
  if (!titleValidation.isValid) {
    return titleValidation;
  }

  // For publishing, content should not be empty
  if (!content || content.trim() === '') {
    return {
      isValid: false,
      message: "Content is required for publishing",
      errorCode: "DOC_CONTENT_REQUIRED",
      errorMessage: "Content is required for publishing"
    };
  }

  return {
    isValid: true,
    message: null,
    errorCode: null,
    errorMessage: null
  };
}
