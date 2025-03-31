
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
  contentId: string | null;
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
