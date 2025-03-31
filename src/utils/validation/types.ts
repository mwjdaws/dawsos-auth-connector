
/**
 * Validation types and interfaces
 */

/**
 * Generic validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage: string | null;
}

/**
 * Content ID validation result with additional type information
 */
export interface ContentIdValidationResult extends ValidationResult {
  resultType: 'valid' | 'invalid' | 'uuid' | 'temp';
}

/**
 * Tag position type for reordering operations
 */
export interface TagPosition {
  id: string;
  position: number;
}
