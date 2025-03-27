
import { useState, useCallback } from "react";
import { handleError, ValidationError } from "@/utils/error-handling";

export function useTagValidator() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateTags = useCallback((tags: string[]): boolean => {
    if (!tags?.length) {
      handleError(
        new ValidationError("No tags provided"),
        "No tags to save"
      );
      setValidationErrors(["No tags provided"]);
      return false;
    }
    
    // Validate individual tags more efficiently with a Set to track invalid tags
    const invalidTags = new Set<string>();
    for (const tag of tags) {
      if (!tag || typeof tag !== 'string' || tag.trim() === '') {
        invalidTags.add(tag || 'empty');
      }
    }
    
    if (invalidTags.size > 0) {
      const errorMessage = `Found ${invalidTags.size} invalid tags`;
      handleError(
        new ValidationError(errorMessage),
        "Some tags are invalid and cannot be saved"
      );
      setValidationErrors([errorMessage]);
      return false;
    }
    
    setValidationErrors([]);
    return true;
  }, []);

  return { 
    validateTags, 
    validationErrors,
    clearValidationErrors: () => setValidationErrors([])
  };
}
