
import { toast } from "@/hooks/use-toast";
import { categorizeError } from "./categorize";
import { ErrorHandlingOptions } from "./types";

/**
 * Central error handling function for the application
 * 
 * @param error The error object to handle
 * @param userMessage Optional user-friendly message to display
 * @param options Additional error handling options
 */
export function handleError(
  error: unknown,
  userMessage?: string,
  options: ErrorHandlingOptions = {}
): void {
  // Ensure we have a proper Error object
  const typedError = categorizeError(error);
  
  // Extract options with defaults
  const {
    level = 'error',
    context = {},
    technical = false,
    silent = false,
    title = 'An error occurred',
    actionLabel,
    action
  } = options;
  
  // Log the error with context for debugging
  console[level]('[Error Handler]', {
    message: typedError.message,
    originalError: error,
    userMessage,
    context,
    stack: typedError.stack
  });
  
  // If silent mode is enabled, don't show UI notifications
  if (silent) return;
  
  // Show toast notification with appropriate details
  toast({
    title,
    description: userMessage || typedError.message,
    variant: "destructive",
    action: actionLabel && action ? {
      label: actionLabel,
      onClick: action
    } : undefined
  });
}
