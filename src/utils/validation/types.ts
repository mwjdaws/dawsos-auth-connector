
/**
 * Standard validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Extended validation result with optional error code
 */
export interface ExtendedValidationResult extends ValidationResult {
  errorCode?: string | null;
  details?: Record<string, any> | null;
}
