
/**
 * Central error handling utility
 */
import { toast } from '@/hooks/use-toast';
import { ErrorOptions } from './types';
import { captureException } from '@/utils/telemetry';

// Default options for error handling
const DEFAULT_ERROR_OPTIONS: Partial<ErrorOptions> = {
  silent: false
};

/**
 * Handle an error in a consistent way across the application
 * 
 * This is the primary error handling utility that should be used app-wide.
 * It centralizes error handling logic for consistent behavior.
 * 
 * @param error The error that occurred
 * @param message Optional custom message to display instead of the error message
 * @param options Additional options for error handling
 */
export function handleError(
  error: unknown,
  message?: string,
  options?: Partial<ErrorOptions>
): void {
  // Merge with default options
  const opts = { ...DEFAULT_ERROR_OPTIONS, ...options };
  
  // Convert to Error if it's not one already
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Get the error message to display
  const displayMessage = opts.errorMessage || message || errorObj.message || 'An error occurred';
  
  // Get the context data
  const context = {
    ...opts.context,
    originalError: errorObj,
    stack: errorObj.stack
  };
  
  // Log the error to console
  console.error('[Error]', displayMessage, context);
  
  // Track the error in analytics
  if (!opts.silent) {
    captureException(errorObj, {
      context,
      extra: { displayMessage }
    });
  }
  
  // Show a toast notification if not silent
  if (!opts.silent) {
    // Determine the toast variant based on the error level
    let variant: "default" | "destructive" | null | undefined;
    
    if (opts.level === 'error') {
      variant = "destructive";
    } else if (opts.level === 'warning') {
      variant = "default"; // Use default for warnings
    } else {
      variant = "default";
    }
    
    toast({
      title: opts.level === 'error' ? 'Error' : 'Warning',
      description: displayMessage,
      variant: variant
    });
  }
}

// Export for backward compatibility
export default handleError;
