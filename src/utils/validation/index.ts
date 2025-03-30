
/**
 * Validation utility functions
 */

// Re-export from contentIdValidation for backward compatibility
export { isValidContentId } from './contentIdValidation';
export { validateContentId, getContentIdValidationResult } from './contentIdValidation';
export { validateTag, validateTags } from './tagValidation';
export { validateDocument, validateDocumentTitle } from './documentValidation';

// Export compatibility layer
export { 
  ensureString, 
  nullToUndefined, 
  undefinedToNull,
  safeCallback,
  createCompatibleValidationResult,
  VALIDATION_RESULTS
} from './compatibility';

// Re-export types
export * from './types';
