
/**
 * Shared validation types
 */

// Basic validation result interface
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message?: string;
  warnings?: string[];
}

// Content validation result with existence checks
export interface ContentValidationResult extends ValidationResult {
  contentExists: boolean;
  contentId?: string | null;
}

// Tag validation result with specific tag error types
export interface TagValidationResult extends ValidationResult {
  tagExists?: boolean;
  isDuplicate?: boolean;
  isReserved?: boolean;
}

// Form field validation result
export interface FieldValidationResult extends ValidationResult {
  fieldName: string;
  value: any;
}

// Form validation result containing field validations
export interface FormValidationResult extends ValidationResult {
  fields: Record<string, FieldValidationResult>;
}

// External source validation result
export interface ExternalSourceValidationResult extends ValidationResult {
  isValidUrl: boolean;
  isAccessible?: boolean;
  lastCheckedAt?: string | null;
}

/**
 * Create a valid validation result
 * Utility function to create a validation result that is valid
 */
export function createValidResult(message?: string): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    message: message || 'Valid'
  };
}

/**
 * Create an invalid validation result
 * Utility function to create a validation result that is invalid
 */
export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    message: null
  };
}

/**
 * Create a content validation result
 * Utility function to create a validation result for content
 */
export function createContentValidationResult(
  isValid: boolean,
  contentExists: boolean,
  message: string | null = null,
  contentId: string | null = null
): ContentValidationResult {
  return {
    isValid,
    contentExists,
    errorMessage: isValid ? null : message,
    message: isValid ? message : null,
    contentId
  };
}
