
/**
 * Content validation utilities
 */
import { 
  ContentIdValidationResult, 
  ContentIdValidationResultType 
} from './validation/types';
import { 
  validateContentId as validateContentIdOriginal,
  isValidContentId as isValidContentIdOriginal,
  getContentIdValidationResult
} from './validation/contentIdValidation';
import { VALIDATION_RESULTS } from './validation/compatibility';

/**
 * Simple validation of a content ID
 * This version is compatible with all components
 */
export function isValidContentId(contentId?: string | null): boolean {
  return isValidContentIdOriginal(contentId);
}

/**
 * Full content ID validation with detailed result
 */
export function validateContentId(contentId?: string | null): ContentIdValidationResult {
  return validateContentIdOriginal(contentId);
}

/**
 * Higher-level validation for content existence check
 */
export function contentExists(contentId?: string | null): boolean {
  if (!contentId) return false;
  
  const result = validateContentId(contentId);
  return result.isValid && result.result !== VALIDATION_RESULTS.TEMPORARY;
}

/**
 * Check if content ID is temporary
 */
export function isTemporaryContent(contentId?: string | null): boolean {
  if (!contentId) return false;
  
  const result = validateContentId(contentId);
  return result.result === VALIDATION_RESULTS.TEMPORARY;
}
