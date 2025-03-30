
/**
 * Validation utility functions
 */

// Re-export from contentIdValidation for backward compatibility
export { isValidContentId } from './contentIdValidation';
export { validateContentId, getContentIdValidationResult } from './contentIdValidation';
export { validateTag, validateTags } from './tagValidation';
export { validateDocument, validateDocumentTitle } from './documentValidation';

// Re-export types
export * from './types';
