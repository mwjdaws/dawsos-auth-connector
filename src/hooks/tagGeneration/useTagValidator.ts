
import { useCallback } from "react";
import { handleError, ValidationError } from "@/utils/error-handling";

/**
 * Hook for tag generation input validation
 */
export function useTagValidator() {
  const validateInput = useCallback((text: string): boolean => {
    if (!text.trim()) {
      handleError(
        new ValidationError("Empty content"),
        "Please enter some content to generate tags"
      );
      return false;
    }
    
    // Additional validation could be added here 
    // (e.g., minimum length, content type checks, etc.)
    return true;
  }, []);

  return { validateInput };
}
