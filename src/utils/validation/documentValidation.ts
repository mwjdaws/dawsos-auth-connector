
/**
 * Validates a document title
 * @param title Title to validate
 * @returns Object containing validation result and any error message
 */
export const validateDocumentTitle = (title: string): { 
  isValid: boolean; 
  errorMessage: string | null;
} => {
  // Check for empty title
  if (!title || !title.trim()) {
    return {
      isValid: false,
      errorMessage: "Please enter a title before saving"
    };
  }

  // Check for minimum length
  if (title.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: "Title must be at least 3 characters long"
    };
  }

  // Check for maximum length
  if (title.trim().length > 100) {
    return {
      isValid: false,
      errorMessage: "Title cannot exceed 100 characters"
    };
  }

  // Check for invalid characters
  const invalidCharsRegex = /[<>{}[\]\\^~|]/;
  if (invalidCharsRegex.test(title)) {
    return {
      isValid: false,
      errorMessage: "Title contains invalid characters"
    };
  }

  return {
    isValid: true,
    errorMessage: null
  };
};
