
/**
 * Central export point for validation utilities
 */

// Re-export from validation submodules
export * from './validation/contentIdValidation';
export * from './validation/documentValidation';
export * from './validation/tagValidation';
export * from './validation/types';
export * from './validation/utils';

// Re-export hooks
export { useContentIdValidation } from './validation/hooks/useContentIdValidation';
export { useContentValidator } from './validation/hooks/useContentValidator';
export { useValidateContentId } from './validation/hooks/useValidateContentId';
export { useTagValidation } from './validation/hooks/useTagValidation';
export { useValidatedTagOperations } from './validation/hooks/useValidatedTagOperations';

// Export specific types
export type {
  ValidationResult,
  ContentIdValidationResult,
  TagValidationResult,
  OntologyTermValidationResult,
  DocumentValidationResult
} from './validation/types';

// Export result creation functions with proper type checking
export {
  createValidResult,
  createInvalidResult,
  createContentIdValidationResult,
  createTagValidationResult,
  createOntologyTermValidationResult,
  createDocumentValidationResult
} from './validation/types';

// Export additional utilities
export { isValidResult, combineValidationResults } from './validation/utils';
