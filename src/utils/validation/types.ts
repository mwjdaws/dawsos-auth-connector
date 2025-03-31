
/**
 * Validation Types
 * 
 * Shared type definitions for validation functions and hooks.
 */

// Basic validation result
export interface ValidationResult {
  isValid: boolean;
  message?: string | null;
  errorMessage?: string | null;
}

// Content ID validation result types
export type ContentIdResultType = 'uuid' | 'temp' | 'invalid';

// Content ID validation result (extends basic validation result)
export interface ContentIdValidationResult extends ValidationResult {
  resultType: ContentIdResultType;
  message: string | null;
  errorMessage: string | null;
}

// Tag validation result
export interface TagValidationResult extends ValidationResult {
  tag?: string;
}
