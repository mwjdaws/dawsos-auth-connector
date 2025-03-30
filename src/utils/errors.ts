
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export interface ErrorHandlingOptions {
  level?: 'info' | 'warning' | 'error' | 'success';
  context?: Record<string, any>;
  actionLabel?: string;
  action?: () => void;
  title?: string;
  technical?: boolean;
  silent?: boolean;
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
  const { 
    level = 'error', 
    context = {}, 
    actionLabel, 
    action,
    title,
    technical = false,
    silent = false
  } = options;
  
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
  
  // If silent mode is enabled, don't show a toast
  if (silent) return;
  
  // Determine what message to show (technical details or user-friendly)
  const displayMessage = userMessage || (technical ? errorMessage : defaultMessage);
  
  // Map level to variant for toast
  const variantMap = {
    'error': 'destructive',
    'warning': 'default',
    'info': 'default',
    'success': 'default'
  } as const;
  
  // Display toast notification
  toast({
    title: title || (level === 'error' ? 'Error' : level === 'warning' ? 'Warning' : level === 'info' ? 'Notice' : 'Success'),
    description: displayMessage,
    variant: variantMap[level],
    action: actionLabel && action ? (
      <ToastAction altText={actionLabel} onClick={action}>
        {actionLabel}
      </ToastAction>
    ) : undefined
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

// Re-export other error handling utilities for backward compatibility
export * from './errors/types';
export * from './errors/categorize';
export * from './errors/handle';
export * from './errors/wrappers';
