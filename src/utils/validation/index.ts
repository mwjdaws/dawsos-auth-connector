
// Import all validation functions and types
import { validateDocumentTitle } from './documentValidation';
import { 
  isValidContentId, 
  normalizeContentId, 
  getContentIdValidationResult,
  ContentIdValidationResult 
} from './contentIdValidation';
import { 
  validateTag, 
  validateTags,
  ValidationResult,
  TagValidationOptions 
} from './tagValidation';

// Document validation
export { validateDocumentTitle };

// Content ID validation
export { 
  isValidContentId,
  normalizeContentId,
  getContentIdValidationResult,
  ContentIdValidationResult
};

// Tag validation functions
export { validateTag, validateTags };

// Export types properly
export type { ValidationResult, TagValidationOptions, ContentIdValidationResult };

// Backward compatibility (with deprecation notices)
/**
 * @deprecated Use isValidContentId from @/utils/validation instead.
 */
export { 
  isValidContentId as isValidId,
  normalizeContentId as normalizeId,
  getContentIdValidationResult as getIdValidationResult
} from './contentIdValidation';
