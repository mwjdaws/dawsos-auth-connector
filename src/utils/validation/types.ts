
/**
 * Standard validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorCode?: string | null;
}

/**
 * Extended validation result with additional details
 */
export interface ExtendedValidationResult extends ValidationResult {
  details?: Record<string, any> | null;
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Tag validation options
 */
export interface TagValidationOptions {
  allowEmpty?: boolean;
  maxTags?: number;
  minLength?: number;
  maxLength?: number;
}

/**
 * Tag position for reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}
