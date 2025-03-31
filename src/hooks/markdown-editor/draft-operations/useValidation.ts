
import { toast } from '@/hooks/use-toast';
import { validateDocument } from '@/utils/validation/documentValidation';
import { ValidationResult } from '@/utils/validation/types';

export function useValidation() {
  /**
   * Validate document for saving
   */
  const validateDocumentForSave = (title: string): ValidationResult => {
    // Use the existing validation function with title
    const validationResult = validateDocument({ title, content: '' });
    
    if (!validationResult.isValid) {
      // Show toast with error message
      toast({
        title: "Validation Error",
        description: validationResult.errorMessage || "Please fix validation errors before saving",
        variant: "destructive"
      });
    }
    
    return validationResult;
  };

  return {
    validateDocumentForSave
  };
}
