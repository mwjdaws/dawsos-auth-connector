
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
      message: 'Title validation passed',
      errorMessage: null
    };
  }, []);

  /**
   * Validates a document content
   * 
   * @param content Document content to validate
   * @returns Validation result
   */
  const validateContent = useCallback((content: string): ValidationResult => {
    // Use the existing validation function
    return validateDocument({ title: '', content });
  }, []);

  /**
   * Validates a document before publishing
   * 
   * @param title Document title
   * @param content Document content
   * @returns Validation result
   */
  const validateForPublish = useCallback((title: string, content: string): ValidationResult => {
    // First check title
    const titleValidation = validateTitle(title);
    if (!titleValidation.isValid) {
      setValidationResult(titleValidation);
      return titleValidation;
    }
    
    // Then check content
    const contentValidation = validateContent(content);
    if (!contentValidation.isValid) {
      setValidationResult(contentValidation);
      return contentValidation;
    }
    
    // All checks passed
    const result = {
      isValid: true,
      message: 'Document is valid for publishing',
      errorMessage: null
    };
    
    setValidationResult(result);
    return result;
  }, [validateTitle, validateContent]);

  return {
    validateTitle,
    validateContent,
    validateForPublish,
    validationResult
  };
}
