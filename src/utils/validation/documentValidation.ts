
import { ValidationResult } from './types';
import { createValidResult, createInvalidResult } from './utils';

/**
 * Validates a document title
 */
export function validateDocumentTitle(title: string | null | undefined): ValidationResult {
  if (!title || title.trim().length === 0) {
    return createInvalidResult('Document title is required');
  }
  
  if (title.trim().length < 3) {
    return createInvalidResult('Document title must be at least 3 characters');
  }
  
  if (title.trim().length > 100) {
    return createInvalidResult('Document title must be at most 100 characters');
  }
  
  return createValidResult('Valid document title');
}

/**
 * Validates document content
 */
export function validateDocumentContent(content: string | null | undefined): ValidationResult {
  if (!content) {
    return createInvalidResult('Document content is required');
  }
  
  if (content.trim().length === 0) {
    return createInvalidResult('Document content cannot be empty');
  }
  
  // Additional content validations could be added here
  
  return createValidResult('Valid document content');
}

/**
 * Validates a URL string
 */
export function validateUrl(url: string | null | undefined): ValidationResult {
  if (!url || url.trim().length === 0) {
    return createValidResult('No URL provided');
  }
  
  try {
    new URL(url);
    return createValidResult('Valid URL format');
  } catch (e) {
    return createInvalidResult('Invalid URL format');
  }
}
