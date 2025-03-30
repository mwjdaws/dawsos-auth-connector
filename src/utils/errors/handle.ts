
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ErrorHandlingOptions } from './types';
import { categorizeError } from './categorize';

/**
 * Centralized error handling function
 * 
 * @param error The error object
 * @param userMessage User-friendly message to display
 * @param options Additional error handling options
 */
export function handleError(
  error: unknown,
  userMessage?: string,
  options?: ErrorHandlingOptions
): void {
  // Categorize the error first
  const categorizedError = categorizeError(error);
  
  // Extract error details
  const errorMessage = categorizedError.message;
  const errorType = categorizedError.name;
  
  // Prepare context data
  const context = {
    timestamp: new Date().toISOString(),
    errorType,
    errorMessage,
    userMessage: userMessage || errorMessage,
    ...(options?.context || {})
  };
  
  // Log error with context to console
  console.error(`[${context.timestamp}] ${errorType}: ${errorMessage}`, {
    context,
    originalError: error,
  });
  
  // Determine logging level
  const level = options?.level || 'error';
  
  // Handle based on error level
  switch (level) {
    case 'warning':
      console.warn(`Warning: ${userMessage || errorMessage}`, context);
      break;
    case 'info':
      console.info(`Info: ${userMessage || errorMessage}`, context);
      break;
    case 'debug':
      console.debug(`Debug: ${userMessage || errorMessage}`, context);
      break;
    case 'error':
    default:
      // Don't log again if already logged above
      break;
  }
  
  // Don't show UI toast if silent is specified
  if (options?.silent) {
    return;
  }
  
  // Show toast notification if needed
  const toastTitle = options?.title || (level === 'error' ? 'Error' : 
                     level === 'warning' ? 'Warning' : 'Notice');
  
  const toastMessage = userMessage || errorMessage;
  
  // Map level to toast variant - ensure we only use valid variants
  const variant = level === 'error' ? 'destructive' : 'default';
  
  toast({
    title: toastTitle,
    description: toastMessage,
    variant: variant,
    // Include action if provided
    action: options?.actionLabel && options?.action ? (
      <ToastAction altText={options.actionLabel} onClick={options.action}>
        {options.actionLabel}
      </ToastAction>
    ) : undefined
  });
}
