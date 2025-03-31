
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { validateTag } from "@/utils/validation";
import { TagValidationOptions } from "@/utils/validation/types";

export function useTagValidator() {
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  /**
   * Validates a tag with proper error handling
   * 
   * @param tagText The text to validate
   * @param options Validation options
   * @returns True if the tag is valid, false otherwise
   */
  const validateTagText = useCallback((tagText: string, options?: TagValidationOptions) => {
    // Default options
    const validationOptions: TagValidationOptions = {
      maxLength: options?.maxLength || 50,
      minLength: options?.minLength || 1,
      allowSpecialChars: options?.allowSpecialChars || false,
      allowEmpty: options?.allowEmpty || false,
    };

    const result = validateTag(tagText, validationOptions);
    
    // Set validation message for UI display
    setValidationMessage(result.errorMessage || result.message || null);
    
    // Show toast for validation errors
    if (!result.isValid && result.errorMessage) {
      toast({
        title: "Invalid Tag",
        description: result.errorMessage,
        variant: "destructive",
      });
    }
    
    return result.isValid;
  }, []);

  return {
    validateTagText,
    validationMessage,
    clearValidationMessage: () => setValidationMessage(null)
  };
}
