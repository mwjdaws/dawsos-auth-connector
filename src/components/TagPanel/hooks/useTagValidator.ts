
import { useState } from 'react';
import { validateTags, ValidationResult, TagValidationOptions } from '@/utils/validation';

/**
 * Hook for validating tags
 * Provides a convenient way to validate tags with customizable options
 */
export function useTagValidator() {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    message: null
  });

  const validate = (tags: string[], options?: TagValidationOptions): boolean => {
    const result = validateTags(tags, options);
    setValidationResult(result);
    return result.isValid;
  };

  const resetValidation = () => {
    setValidationResult({
      isValid: true,
      message: null
    });
  };

  return {
    validate,
    resetValidation,
    validationResult,
    isValid: validationResult.isValid,
    errorMessage: validationResult.message
  };
}
