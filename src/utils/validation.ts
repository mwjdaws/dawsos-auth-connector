/**
 * Validation Hooks
 * 
 * Central export point for all validation-related hooks.
 */

// Content validation
export * from './useContentIdValidation';
export * from './useContentValidator';
export * from './useValidateContentId';

// Tag validation
export * from './useTagValidation';
export * from './useValidatedTagOperations';

// Export compatibility types
export type { ValidationResult, ContentIdValidationResult } from '@/utils/validation/types';

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult extends ValidationResult {
  resultType: 'contentId';
  contentExists: boolean;
}

/**
 * Create ContentIdValidationResult
 */
export function createContentIdValidationResult(isValid: boolean, message: string | null, errorMessage: string | null, contentExists: boolean): ContentIdValidationResult {
  return {
    isValid,
    message,
    errorMessage,
    resultType: 'contentId',
    contentExists
  };
}

/**
 * Tag validation result
 */
export interface TagValidationResult extends ValidationResult {
  resultType: 'tag';
}

/**
 * Create TagValidationResult
 */
export function createTagValidationResult(isValid: boolean, message: string | null, errorMessage: string | null): TagValidationResult {
  return {
    isValid,
    message,
    errorMessage,
    resultType: 'tag'
  };
}

/**
 * Ontology term validation result
 */
export interface OntologyTermValidationResult extends ValidationResult {
  resultType: 'ontologyTerm';
}

/**
 * Create OntologyTermValidationResult
 */
export function createOntologyTermValidationResult(isValid: boolean, message: string | null, errorMessage: string | null): OntologyTermValidationResult {
  return {
    isValid,
    message,
    errorMessage,
    resultType: 'ontologyTerm'
  };
}
