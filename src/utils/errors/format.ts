
/**
 * Error formatting utilities
 */

/**
 * Format an error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

/**
 * Format a technical error message for developers
 */
export function formatTechnicalError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\nStack: ${error.stack || 'No stack trace available'}`;
  }
  
  return `Technical error: ${JSON.stringify(error)}`;
}

/**
 * Get a user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  // Map common error types to user-friendly messages
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('network') || error.message.includes('connection')) {
      return 'There was a problem with your internet connection. Please check your connection and try again.';
    }
    
    // Authentication errors
    if (error.message.includes('authentication') || error.message.includes('auth') || 
        error.message.includes('login') || error.message.includes('permission')) {
      return 'You may need to sign in again to continue. Please refresh the page and try again.';
    }
    
    // Timeout errors
    if (error.message.includes('timeout') || error.message.includes('timed out')) {
      return 'The operation took too long to complete. Please try again later.';
    }
    
    // Server errors
    if (error.message.includes('server') || error.message.includes('500')) {
      return 'There was a problem on our end. We\'re working to fix it. Please try again later.';
    }
  }
  
  // Default friendly message
  return 'Something went wrong. Please try again or contact support if the problem persists.';
}
