
/**
 * Validation utilities for documents
 */
import { ValidationResult, DocumentValidationResult, DocumentValidationOptions } from './types';
import { createValidationResult } from './types';

/**
 * Validates a document title
 * @param title The title to validate
 * @param options Validation options
 * @returns A validation result
 */
export function validateDocumentTitle(
  title: string, 
  options: DocumentValidationOptions = {}
): DocumentValidationResult {
  const {
    titleRequired = true,
    minTitleLength = 1,
    maxTitleLength = 255
  } = options;
  
  if (titleRequired && (!title || title.trim().length === 0)) {
    return {
      isValid: false,
      errorMessage: "Title is required",
      field: 'title'
    };
  }
  
  if (title && title.trim().length < minTitleLength) {
    return {
      isValid: false,
      errorMessage: `Title must be at least ${minTitleLength} characters`,
      field: 'title'
    };
  }
  
  if (title && title.length > maxTitleLength) {
    return {
      isValid: false,
      errorMessage: `Title cannot exceed ${maxTitleLength} characters`,
      field: 'title'
    };
  }
  
  return {
    isValid: true,
    errorMessage: null,
    field: 'title'
  };
}

/**
 * Validates document content
 * @param content The content to validate
 * @param options Validation options
 * @returns A validation result
 */
export function validateDocumentContent(
  content: string,
  options: DocumentValidationOptions = {}
): DocumentValidationResult {
  const {
    contentRequired = true,
    minContentLength = 1,
    maxContentLength = 100000 // 100k chars
  } = options;
  
  if (contentRequired && (!content || content.trim().length === 0)) {
    return {
      isValid: false,
      errorMessage: "Content is required",
      field: 'content'
    };
  }
  
  if (content && content.trim().length < minContentLength) {
    return {
      isValid: false,
      errorMessage: `Content must be at least ${minContentLength} characters`,
      field: 'content'
    };
  }
  
  if (content && content.length > maxContentLength) {
    return {
      isValid: false,
      errorMessage: `Content cannot exceed ${maxContentLength} characters`,
      field: 'content'
    };
  }
  
  return {
    isValid: true,
    errorMessage: null,
    field: 'content'
  };
}

/**
 * Validates an entire document (title and content)
 * @param document The document to validate
 * @param options Validation options
 * @returns A validation result
 */
export function validateDocument(
  document: { title: string; content: string },
  options: DocumentValidationOptions = {}
): DocumentValidationResult {
  const titleResult = validateDocumentTitle(document.title, options);
  if (!titleResult.isValid) {
    return titleResult;
  }
  
  const contentResult = validateDocumentContent(document.content, options);
  if (!contentResult.isValid) {
    return contentResult;
  }
  
  return {
    isValid: true,
    errorMessage: null
  };
}
