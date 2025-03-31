
/**
 * Document validation utilities
 * 
 * Functions for validating document content and metadata
 */
import { DocumentValidationOptions, ValidationResult } from './types';
import { createValidResult, createInvalidResult } from './types';

interface DocumentContent {
  title: string;
  content: string;
}

/**
 * Validates a document's title and content
 * 
 * @param document The document to validate
 * @param options Validation options
 * @returns Validation result object
 */
export function validateDocument(
  document: DocumentContent,
  options: DocumentValidationOptions = {}
): ValidationResult {
  const {
    requireTitle = true,
    minTitleLength = 3,
    maxTitleLength = 255,
    requireContent = true,
    minContentLength = 10
  } = options;
  
  // Validate title
  if (requireTitle && (!document.title || document.title.trim().length === 0)) {
    return createInvalidResult('Title is required');
  }
  
  if (document.title && document.title.length < minTitleLength) {
    return createInvalidResult(`Title must be at least ${minTitleLength} characters`);
  }
  
  if (document.title && document.title.length > maxTitleLength) {
    return createInvalidResult(`Title must be at most ${maxTitleLength} characters`);
  }
  
  // Validate content
  if (requireContent && (!document.content || document.content.trim().length === 0)) {
    return createInvalidResult('Content is required');
  }
  
  if (document.content && document.content.length < minContentLength) {
    return createInvalidResult(`Content must be at least ${minContentLength} characters`);
  }
  
  return createValidResult();
}

/**
 * Validates a document title
 * 
 * @param title The title to validate
 * @param options Validation options
 * @returns Validation result object
 */
export function validateTitle(
  title: string,
  options: DocumentValidationOptions = {}
): ValidationResult {
  const {
    requireTitle = true,
    minTitleLength = 3,
    maxTitleLength = 255
  } = options;
  
  if (requireTitle && (!title || title.trim().length === 0)) {
    return createInvalidResult('Title is required');
  }
  
  if (title && title.length < minTitleLength) {
    return createInvalidResult(`Title must be at least ${minTitleLength} characters`);
  }
  
  if (title && title.length > maxTitleLength) {
    return createInvalidResult(`Title must be at most ${maxTitleLength} characters`);
  }
  
  return createValidResult();
}

/**
 * Validates document content
 * 
 * @param content The content to validate
 * @param options Validation options
 * @returns Validation result object
 */
export function validateContent(
  content: string,
  options: DocumentValidationOptions = {}
): ValidationResult {
  const {
    requireContent = true,
    minContentLength = 10
  } = options;
  
  if (requireContent && (!content || content.trim().length === 0)) {
    return createInvalidResult('Content is required');
  }
  
  if (content && content.length < minContentLength) {
    return createInvalidResult(`Content must be at least ${minContentLength} characters`);
  }
  
  return createValidResult();
}
