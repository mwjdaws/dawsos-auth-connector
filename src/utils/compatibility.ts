
/**
 * Type compatibility layer for backward compatibility
 */
import { ErrorHandlingOptions } from './errors/types';

// Backward compatibility for old error handling API
export interface ErrorHandlingCompatOptions extends ErrorHandlingOptions {
  // Add any legacy options here
  level?: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  preventDuplicate?: boolean;
}

// Validate content ID options
export interface ContentIdValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  type: ContentIdValidationResultType;
}

export type ContentIdValidationResultType = 'valid' | 'empty' | 'invalid' | 'not-found';

// Tag position for reordering
export interface TagPosition {
  id: string;
  position: number;
}

// Tag validation options
export interface TagValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowSpecialChars?: boolean;
  required?: boolean;
  uniqueInList?: string[];
}
