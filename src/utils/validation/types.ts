
/**
 * Types for validation utilities
 */

// Generic validation result type
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage?: string;
}

// Tag position for reordering
export interface TagPosition {
  id: string;
  position: number;
}

// Export other validation types as needed
