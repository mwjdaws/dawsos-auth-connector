import { useState, useCallback } from 'react';
import { validateTags } from '@/utils/validation';

interface TagValidationResult {
  isValid: boolean;
  message: string;
}

export const useTagValidator = () => {
  const [validationResult, setValidationResult] = useState<TagValidationResult>({
    isValid: true,
    message: '',
  });

  const validate = useCallback((tags: string[]): boolean => {
    const result = validateTags(tags);
    setValidationResult({
      isValid: result.isValid,
      message: result.message || '',
    });
    return result.isValid;
  }, []);

  return {
    validationResult,
    validate,
  };
};
