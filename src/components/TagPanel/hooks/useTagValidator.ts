
import { useState, useCallback } from 'react';
import { validateTags } from '@/utils/validation/tagValidation';
import type { ValidationResult, TagValidationOptions } from '@/utils/validation';

export const useTagValidator = (minTagLength = 2, maxTagLength = 30, maxNumTags = 20) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    message: '',
  });

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
