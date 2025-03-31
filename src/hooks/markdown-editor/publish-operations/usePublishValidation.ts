import { useState, useCallback } from 'react';
import { validateDocument } from '@/utils/validation/documentValidation';
import { toast } from '@/hooks/use-toast';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage: string | null;
}

export function usePublishValidation() {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const validateTitle = useCallback((title: string): ValidationResult => {
    if (!title || title.trim() === '') {
      return {
        isValid: false,
        message: 'Title is required',
        errorMessage: 'Title is required before publishing'
      };
    }

    if (title.length < 3) {
      return {
        isValid: false,
        message: 'Title must be at least 3 characters',
        errorMessage: 'Title is too short. Please use at least 3 characters.'
      };
    }

    return {
      isValid: true,
      message: null,
      errorMessage: null
    };
  }, []);

  const validateForPublish = (title: string): ValidationResult => {
    const titleValidation = validateTitle(title);
    
    // If title is invalid, return that error
    if (!titleValidation.isValid) {
      return titleValidation;
    }
    
    // All checks passed
    return {
      isValid: true,
      message: null
    };
  };

  return {
    validateTitle,
    validateContent: validateDocument,
    validateForPublish,
    validationResult
  };
}
