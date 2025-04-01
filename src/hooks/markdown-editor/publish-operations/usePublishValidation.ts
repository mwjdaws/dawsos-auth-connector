
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { ValidationResult, createValidResult, createInvalidResult } from '@/utils/validation/types';

/**
 * Hook for validation during the publishing process
 */
export function usePublishValidation() {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  /**
   * Validate if a document is ready for publishing
   */
  const validateForPublish = useCallback((title: string, content: string): ValidationResult => {
    // Check for title
    if (!title || title.trim() === '') {
      const result = createInvalidResult('Title is required for publishing', null, 'content');
      setValidationResult(result);
      
      toast({
        title: "Validation Error",
        description: "A title is required before publishing",
        variant: "destructive"
      });
      
      return result;
    }
    
    // Check for minimum content length
    if (!content || content.trim().length < 10) {
      const result = createInvalidResult('Content is too short for publishing', null, 'content');
      setValidationResult(result);
      
      toast({
        title: "Validation Error",
        description: "Content is too short to publish",
        variant: "destructive"
      });
      
      return result;
    }
    
    // All validations passed
    const result = createValidResult('Document is ready for publishing', 'content');
    setValidationResult(result);
    return result;
  }, []);

  /**
   * Validate an external source URL
   */
  const validateExternalSource = useCallback((url: string | null): ValidationResult => {
    if (!url) {
      return createValidResult('No external source provided', 'content');
    }
    
    try {
      // Basic URL validation
      new URL(url);
      
      // More advanced checks could be added here for specific domains, etc.
      
      // URL is valid
      return createValidResult('Valid external source URL', 'content');
    } catch (e) {
      const result = createInvalidResult('Invalid external source URL', null, 'content');
      
      toast({
        title: "Invalid URL",
        description: "The external source URL is invalid",
        variant: "destructive"
      });
      
      return result;
    }
  }, []);
  
  /**
   * Clear validation state
   */
  const resetValidation = useCallback(() => {
    setValidationResult(null);
  }, []);
  
  /**
   * Set a validation message directly
   */
  const setValidationMessage = useCallback((isValid: boolean, message: string) => {
    const result = isValid 
      ? createValidResult(message, 'content')
      : createInvalidResult(message, null, 'content');
      
    setValidationResult(result);
    return result;
  }, []);

  return {
    validationResult,
    validateForPublish,
    validateExternalSource,
    resetValidation,
    setValidationMessage
  };
}
