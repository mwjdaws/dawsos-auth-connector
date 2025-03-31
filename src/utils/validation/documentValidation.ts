
/**
 * Document validation utilities
 * 
 * Functions for validating documents.
 */

import { DocumentValidationOptions, DocumentValidationResult } from './types';

/**
 * Validates a document title
 */
export function validateDocumentTitle(
  title: string,
  options?: DocumentValidationOptions
): DocumentValidationResult {
  const opts = {
    minTitleLength: 1,
    maxTitleLength: 255,
    titleRequired: true,
    ...options
  };

  if (opts.titleRequired && (!title || title.trim().length === 0)) {
    return {
      isValid: false,
      errorMessage: 'Title is required',
      field: 'title',
      resultType: 'missing_title',
      contentExists: false
    };
  }

  if (title && title.length < opts.minTitleLength) {
    return {
      isValid: false,
      errorMessage: `Title must be at least ${opts.minTitleLength} characters`,
      field: 'title',
      resultType: 'title_too_short',
      contentExists: true
    };
  }

  if (title && title.length > opts.maxTitleLength) {
    return {
      isValid: false,
      errorMessage: `Title must be at most ${opts.maxTitleLength} characters`,
      field: 'title',
      resultType: 'title_too_long',
      contentExists: true
    };
  }

  return {
    isValid: true,
    errorMessage: null,
    field: 'title',
    resultType: 'valid',
    contentExists: true
  };
}

/**
 * Validates document content
 */
export function validateDocumentContent(
  content: string,
  options?: DocumentValidationOptions
): DocumentValidationResult {
  const opts = {
    minContentLength: 0,
    maxContentLength: 1000000,
    contentRequired: false,
    ...options
  };

  if (opts.contentRequired && (!content || content.trim().length === 0)) {
    return {
      isValid: false,
      errorMessage: 'Content is required',
      field: 'content',
      resultType: 'missing_content',
      contentExists: false
    };
  }

  if (content && content.length < opts.minContentLength) {
    return {
      isValid: false,
      errorMessage: `Content must be at least ${opts.minContentLength} characters`,
      field: 'content',
      resultType: 'content_too_short',
      contentExists: true
    };
  }

  if (content && content.length > opts.maxContentLength) {
    return {
      isValid: false,
      errorMessage: `Content must be at most ${opts.maxContentLength} characters`,
      field: 'content',
      resultType: 'content_too_long',
      contentExists: true
    };
  }

  return {
    isValid: true,
    errorMessage: null,
    field: 'content',
    resultType: 'valid',
    contentExists: true
  };
}

/**
 * Validates a full document
 */
export function validateDocument(
  document: { title: string; content: string },
  options?: DocumentValidationOptions
): DocumentValidationResult {
  // Validate title
  const titleResult = validateDocumentTitle(document.title, options);
  if (!titleResult.isValid) {
    return titleResult;
  }

  // Validate content
  const contentResult = validateDocumentContent(document.content, options);
  if (!contentResult.isValid) {
    return contentResult;
  }

  // All validations passed
  return {
    isValid: true,
    errorMessage: null,
    contentExists: true,
    resultType: 'valid'
  };
}
