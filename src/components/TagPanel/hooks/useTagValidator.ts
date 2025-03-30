
import { useState, useCallback } from 'react';
import { validateTags, ValidationResult } from '@/utils/validation';

export const useTagValidator = (minTagLength = 2, maxTagLength = 30, maxNumTags = 20) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    message: '',
  });

  const validate = useCallback(
    (tags: string[]): boolean => {
      const result = validateTags(tags, { minTagLength, maxTagLength, maxNumTags });
      setValidationResult(result);
      return result.isValid;
    },
    [minTagLength, maxTagLength, maxNumTags]
  );

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
