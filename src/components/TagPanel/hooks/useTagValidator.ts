
import { useState, useCallback } from "react";
import { handleError } from "@/utils/errors";
import { ValidationError } from "@/utils/errors/types";
import { validateTags } from "@/utils/validation";

/**
 * Hook that provides tag validation functionality
 * 
 * Features:
 * - Validates tags format and content
 * - Tracks validation errors
 * - Provides user-friendly error messages
 * - Uses centralized error handling
 * 
 * @returns Object with validation functions and error state
 */
export function useTagValidator() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  /**
   * Validates an array of tags against common format requirements
   * 
   * @param tags - Array of tag strings to validate
   * @returns boolean indicating if tags are valid
   */
  const validateTagsForSave = useCallback((tags: string[]): boolean => {
    const result = validateTags(tags, true);
    setValidationErrors(result.errors);
    return result.isValid;
  }, []);
  
  return { 
    validateTags: validateTagsForSave, 
    validationErrors,
    clearValidationErrors: () => setValidationErrors([])
  };
}
