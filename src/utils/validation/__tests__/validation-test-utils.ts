
/**
 * Validation utilities for tests
 */
import {
  ValidationResult,
  ContentValidationResult,
  TagValidationResult
} from '../types';
import { createValidResult, createInvalidResult, createContentValidationResult } from '../utils';

/**
 * Create a mock validation result for testing
 */
export function createMockValidationResult(isValid: boolean = true, errorMessage: string | null = null): ValidationResult {
  return isValid ? createValidResult('Test validation message') : createInvalidResult(errorMessage || 'Test error message');
}

/**
 * Create a mock content validation result for testing
 */
export function createMockContentValidationResult(
  isValid: boolean = true,
  contentExists: boolean = true,
  errorMessage: string | null = null,
  contentId: string = 'test-content-id'
): ContentValidationResult {
  return {
    contentId,
    isValid,
    contentExists,
    errorMessage: isValid ? null : (errorMessage || 'Test content error'),
    message: isValid ? 'Test content is valid' : null
  };
}

/**
 * Create a mock tag validation result for testing
 */
export function createMockTagValidationResult(
  isValid: boolean = true,
  tagExists: boolean = true,
  isDuplicate: boolean = false,
  isReserved: boolean = false
): TagValidationResult {
  return {
    isValid,
    errorMessage: isValid ? null : 'Test tag validation error',
    message: isValid ? 'Test tag is valid' : null,
    tagExists,
    isDuplicate,
    isReserved
  };
}
