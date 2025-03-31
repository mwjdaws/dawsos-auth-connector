
/**
 * Validation Hooks
 * 
 * Central export point for all validation-related hooks.
 */

// Content validation
export * from './useContentIdValidation';
export * from './useContentValidator';

// Tag validation
export * from './useTagValidation';

// Export compatibility types
export type { ValidationResult, ContentIdValidationResult } from '@/utils/validation/types';
