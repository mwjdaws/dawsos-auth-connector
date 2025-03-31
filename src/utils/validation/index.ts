
// Re-export all validation utilities for easy access
export { validateContentId, isValidContentId, getContentIdValidationResult } from './contentIdValidation';
export type { ContentIdValidationResult, ContentIdValidationResultType } from './types';
export { validateDocumentTitle } from './types';
export type { ValidationResult, DocumentValidationResult, TagPosition, TagValidationOptions } from './types';

// Export tag validation functions
export { validateTags } from './tagValidation';

// Export document validation functions
export * from './documentValidation';
