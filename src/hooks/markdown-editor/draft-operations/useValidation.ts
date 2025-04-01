
import { toast } from '@/hooks/use-toast';
import { validateDocument } from '@/utils/validation/documentValidation';
import { ValidationResult, createValidResult, createInvalidResult } from '@/utils/validation/types';

/**
 * Hook for document validation operations
 * 
 * Provides functions to validate documents before saving or publishing
 */
export function useValidation() {
  /**
   * Validate document for saving
   * 
   * @param title Document title to validate
   * @param content Optional document content to validate
   * @returns Validation result with isValid flag and any error messages
   */
  const validateDocumentForSave = (title: string, content?: string): ValidationResult => {
    // Use the existing validation function with title and optional content
    const validationResult = validateDocument({ 
      title, 
      content: content || '' 
    });
    
    if (!validationResult.isValid && validationResult.errorMessage) {
      // Show toast with error message
      toast({
        title: "Validation Error",
        description: validationResult.errorMessage,
        variant: "destructive"
      });
    }
    
    return validationResult;
  };

  /**
   * Check if a tag is valid
   * 
   * @param tag Tag text to validate
   * @returns Validation result with isValid flag and any error messages
   */
  const isValidTag = (tag: string): ValidationResult => {
    if (!tag || tag.trim() === '') {
      return createInvalidResult('Tag cannot be empty', null, 'tag');
    }
    
    if (tag.length < 2) {
      return createInvalidResult('Tag must be at least 2 characters long', null, 'tag');
    }
    
    // Add more tag validation rules as needed
    
    return createValidResult(null, 'tag');
  };

  return {
    validateDocumentForSave,
    isValidTag
  };
}
