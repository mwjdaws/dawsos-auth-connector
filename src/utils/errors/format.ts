
/**
 * Error formatting utilities
 * 
 * Consistently format errors for logging and display.
 */

/**
 * Format an unknown error into a consistent error object
 * 
 * @param error The error to format (could be any type)
 * @returns A formatted Error object
 */
export function formatError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  if (typeof error === 'object' && error !== null) {
    // Try to extract message or convert to string
    const message = (error as any).message || JSON.stringify(error);
    const formattedError = new Error(message);
    
    // Copy stack if available
    if ((error as any).stack) {
      formattedError.stack = (error as any).stack;
    }
    
    // Copy other properties for debugging
    Object.assign(formattedError, {
      originalError: error 
    });
    
    return formattedError;
  }
  
  return new Error(`Unknown error: ${String(error)}`);
}

/**
 * Get a user-friendly error message
 * 
 * @param error The error to get a message from
 * @param defaultMessage Default message if no user-friendly message can be extracted
 * @returns A user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown, defaultMessage = 'An unexpected error occurred'): string {
  const formattedError = formatError(error);
  
  // Return the error message if it's likely human-readable
  if (formattedError.message && 
     !formattedError.message.includes('Exception') && 
     !formattedError.message.includes('Error:')) {
    return formattedError.message;
  }
  
  return defaultMessage;
}
