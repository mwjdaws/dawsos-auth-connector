
/**
 * Tag Validator Hook
 * 
 * A custom hook for validating tags against defined rules.
 * It provides validation methods and maintains validation state.
 */
import { useState, useCallback } from 'react';
import { validateTags } from '@/utils/validation';
import type { ValidationResult, TagValidationOptions } from '@/utils/validation';

/**
 * Hook for tag validation with configurable constraints
 * 
 * @param minTagLength - Minimum allowed length for a tag (default: 2)
 * @param maxTagLength - Maximum allowed length for a tag (default: 30)
 * @param maxNumTags - Maximum number of tags allowed (default: 20)
 * @returns Object containing validation methods and current validation state
 */
export const useTagValidator = (minTagLength = 2, maxTagLength = 30, maxNumTags = 20) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    message: '',
  });

  /**
   * Validates an array of tags against the configured constraints
   * 
   * @param tags - Array of tag strings to validate
   * @returns boolean indicating if all tags are valid
   */
  const validate = useCallback(
    (tags: string[]): boolean => {
      const options: TagValidationOptions = { 
        minTagLength, 
        maxTagLength, 
        maxNumTags 
      };
      const result = validateTags(tags, options);
      setValidationResult(result);
      return result.isValid;
    },
    [minTagLength, maxTagLength, maxNumTags]
  );

  /**
   * Validates a single tag against the configured constraints
   * 
   * @param tag - Tag string to validate
   * @returns boolean indicating if the tag is valid
   */
  const validateSingle = useCallback(
    (tag: string): boolean => {
      return validate([tag]);
    },
    [validate]
  );

  return {
    validate,
    validateSingle,
    validationResult,
    resetValidation: () => setValidationResult({ isValid: true, message: '' }),
  };
};
