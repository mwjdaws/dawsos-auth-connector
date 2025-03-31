
/**
 * Common validation types
 */

/**
 * Basic validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * More detailed validation result for content IDs
 */
export interface ContentIdValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message: string | null;
  resultType: string;
}

/**
 * Tag position for ordering tags
 */
export interface TagPosition {
  id: string;
  position: number;
}
