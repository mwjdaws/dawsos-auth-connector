
import { useState, useCallback } from 'react';
import { validateDocument } from '@/utils/validation/documentValidation';
import { toast } from '@/hooks/use-toast';
import { ValidationResult } from '@/utils/validation/types';

/**
 * Hook for validating document content before publishing
 */
export function usePublishValidation() {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  /**
   * Validates a document title
   * 
   * @param title Document title to validate
   * @returns Validation result
   */
  const validateTitle = useCallback((title: string): ValidationResult => {
    if (!title || title.trim() === '') {
      return {
        isValid: false,
        message: null,
        errorMessage: 'Title is required before publishing'
      };
    }

    if (title.length < 3) {
      return {
        isValid: false,
        message: null,
        errorMessage: 'Title is too short. Please use at least 3 characters.'
      };
    }

    return {
      isValid: true,
      message: null,
      errorMessage: ''
    };
  }, []);

  /**
   * Validates a document before publishing
   * 
   * @param title Document title
   * @returns Validation result
   */
  const validateForPublish = (title: string): ValidationResult => {
    const titleValidation = validateTitle(title);
    
    // If title is invalid, return that error
    if (!titleValidation.isValid) {
      return titleValidation;
    }
    
    // All checks passed
    return {
      isValid: true,
      message: null,
      errorMessage: ''
    };
  };

  return {
    validateTitle,
    validateContent: validateDocument,
    validateForPublish,
    validationResult
  };
}
