
import { toast } from '@/hooks/use-toast';
import { validateDocument } from '@/utils/validation/documentValidation';

export function useValidation() {
  /**
   * Validate document for saving
   */
  const validateDocumentForSave = (title: string): { isValid: boolean; errorMessage: string | null } => {
    // Use the existing validation function
    const validationResult = validateDocument(title);
    
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
