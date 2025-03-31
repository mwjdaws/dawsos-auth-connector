
// Re-export all validation utilities for easy access
export { validateContentId, isValidContentId, getContentIdValidationResult } from './contentIdValidation';
export { validateDocumentTitle } from './types';
export { validateTags } from './tagValidation';
export * from './documentValidation';

// Export all types
export type { 
  ValidationResult, 
  DocumentValidationResult, 
  TagPosition, 
  TagValidationOptions,
  ContentIdValidationResult,
  ContentIdValidationResultType
} from './types';
