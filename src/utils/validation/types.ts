
/**
 * Generic validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage?: string | null;
}

/**
 * Content ID validation result
 */
export enum ContentIdValidationResultType {
  Valid = 'valid',
  Invalid = 'invalid',
  Missing = 'missing',
  Empty = 'empty'
}

export interface ContentIdValidationResult {
  isValid: boolean;
  result: ContentIdValidationResultType;
  message: string | null;
}

/**
 * Tag validation options
 */
export interface TagValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowedChars?: RegExp;
  allowEmpty?: boolean;
}
