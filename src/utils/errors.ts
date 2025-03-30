
import { toast } from '@/hooks/use-toast';

interface ErrorHandlingOptions {
  level?: 'info' | 'warning' | 'error';
  context?: Record<string, any>;
  actionLabel?: string;
  action?: () => void;
}

/**
 * Centralized error handling function
 * 
 * @param error The error object
 * @param userMessage Human-friendly message to display
 * @param options Additional options for error handling
 */
export function handleError(
  error: unknown,
  userMessage?: string,
  options: ErrorHandlingOptions = {}
): void {
  const { level = 'error', context = {}, actionLabel, action } = options;
  
  // Default message if none provided
  const defaultMessage = 'An unexpected error occurred';
  
  // Extract message from error
  let errorMessage: string;
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String((error as any).message);
  } else {
    errorMessage = defaultMessage;
  }
  
  // Log the error with context
  console.error('Error:', {
    message: errorMessage,
    originalError: error,
    context
  });
  
  // Display toast notification
  toast({
    title: level === 'error' ? 'Error' : level === 'warning' ? 'Warning' : 'Notice',
    description: userMessage || errorMessage || defaultMessage,
    variant: level === 'error' ? 'destructive' : level === 'warning' ? 'warning' : 'default',
    action: actionLabel && action ? {
      label: actionLabel,
      onClick: action
    } : undefined
  });
}

/**
 * Extract API error details from various error formats
 */
export function extractApiErrorDetails(error: unknown): string {
  if (!error) return 'Unknown error';
  
  // Handle Supabase errors
  if (typeof error === 'object' && error !== null) {
    if ('code' in error && 'message' in error) {
      const code = (error as any).code;
      const message = (error as any).message;
      
      // Handle specific error codes
      if (code === '23505') {
        return 'This record already exists.';
      } else if (code === '23503') {
        return 'Referenced record does not exist.';
      } else if (code === '42P01') {
        return 'Database configuration issue. Please contact support.';
      } else if (code === '23502') {
        return 'Required data is missing.';
      }
      
      return `${message} (Code: ${code})`;
    }
    
    // Handle errors with details property
    if ('details' in error) {
      return String((error as any).details || 'Unknown error');
    }
  }
  
  // Default to standard error handling
  return error instanceof Error 
    ? error.message
    : typeof error === 'string'
      ? error
      : 'Unknown error occurred';
}
