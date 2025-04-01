
import { ValidationResult, createValidResult, createInvalidResult } from './types';

/**
 * Validates a document title
 * 
 * @param title The title to validate
 * @returns Validation result
 */
export function validateDocumentTitle(title: string): ValidationResult {
  if (!title || title.trim() === '') {
    return createInvalidResult('Document title is required');
  }
  
  if (title.trim().length < 3) {
    return createInvalidResult('Document title must be at least 3 characters');
  }
  
  if (title.trim().length > 255) {
    return createInvalidResult('Document title cannot exceed 255 characters');
  }
  
  return createValidResult();
}

/**
 * Validates document content
 * 
 * @param content The document content to validate
 * @returns Validation result
 */
export function validateDocumentContent(content: string): ValidationResult {
  if (!content || content.trim() === '') {
    return createInvalidResult('Document content is required');
  }
  
  return createValidResult();
}

/**
 * Validates a URL
 * 
 * @param url The URL to validate
 * @returns Validation result
 */
export function validateUrl(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return createValidResult(); // Empty URL is valid (no external source)
  }
  
  try {
    new URL(url);
    return createValidResult();
  } catch (error) {
    return createInvalidResult('Invalid URL format');
  }
}
