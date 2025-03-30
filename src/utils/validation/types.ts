
/**
 * Standard validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorCode?: string | null;
  errorMessage?: string | null; // Added for backward compatibility
}

/**
 * Extended validation result with additional details
 */
export interface ExtendedValidationResult extends ValidationResult {
  details?: Record<string, any> | null;
}

/**
 * Content ID validation result type enum
 */
export enum ContentIdValidationResultType {
  VALID = 'valid',
  TEMPORARY = 'temporary',
  MISSING = 'missing',
  INVALID = 'invalid'
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult {
  isValid: boolean;
  message: string | null;
  resultType: ContentIdValidationResultType;
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
