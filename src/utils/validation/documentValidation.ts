
import { ValidationResult } from './types';
import { createValidResult, createInvalidResult } from './types';

/**
 * Validates a document title
 */
export function validateDocumentTitle(title: string): ValidationResult {
  if (!title || title.trim() === '') {
    return createInvalidResult('Title is required');
  }
  
  if (title.length < 3) {
    return createInvalidResult('Title must be at least 3 characters');
  }
  
  if (title.length > 255) {
    return createInvalidResult('Title must be less than 255 characters');
  }
  
  return createValidResult('Title is valid');
}

/**
 * Validates document content
 */
export function validateDocumentContent(content: string): ValidationResult {
  if (!content || content.trim() === '') {
    return createInvalidResult('Content is required');
  }
  
  return createValidResult('Content is valid');
}

/**
 * Validates a URL
 */
export function validateUrl(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return createValidResult('No URL provided');
  }
  
  try {
    new URL(url);
    return createValidResult('URL is valid');
  } catch (e) {
    return createInvalidResult('Invalid URL format');
  }
}

/**
 * Validates a complete document
 */
export function validateDocument(document: { title: string; content: string }): ValidationResult {
  const titleValidation = validateDocumentTitle(document.title);
  if (!titleValidation.isValid) {
    return titleValidation;
  }
  
  const contentValidation = validateDocumentContent(document.content);
  if (!contentValidation.isValid) {
    return contentValidation;
  }
  
  return createValidResult('Document is valid');
}
