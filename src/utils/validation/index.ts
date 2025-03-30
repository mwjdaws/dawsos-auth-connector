
/**
 * Validation utilities - exports for backward compatibility
 */

export { 
  isValidContentId,
  getContentIdValidationResult,
  type ContentIdValidationResult
} from './contentIdValidation';

// Export compatibility functions
export {
  ensureString,
  nullToUndefined,
  undefinedToNull,
  safeCallback,
  createCompatibleValidationResult,
  VALIDATION_RESULTS
} from './compatibility';

