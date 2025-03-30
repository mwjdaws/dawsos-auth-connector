
import { toast } from "@/hooks/use-toast";
import { categorizeError } from "./categorize";
import { ErrorHandlingOptions, ErrorLevel } from "./types";
import { ToastAction } from "@/components/ui/toast";
import React from "react";

/**
 * Central error handling function for the application
 * 
 * Processes errors in a consistent way throughout the application by:
 * - Categorizing and normalizing the error
 * - Logging error details with context
 * - Displaying user-friendly notifications when appropriate
 * - Supporting action callbacks for error recovery
 * 
 * @param error - The error object to handle (can be any type)
 * @param userMessage - Optional user-friendly message to display
 * @param options - Additional error handling options
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
    action,
    // Add option to prevent duplicate toasts
    preventDuplicate = false,
  } = options;
  
  // Map 'warning' to 'warn' for console methods
  const consoleLevel = level === 'warning' ? 'warn' : level;
  
  // Log the error with context for debugging
  console[consoleLevel as 'log' | 'info' | 'warn' | 'error']('[Error Handler]', {
    message: typedError.message,
    originalError: error,
    userMessage,
    context,
    stack: typedError.stack
  });
  
  // If silent mode is enabled, don't show UI notifications
  if (silent) return;
  
  // Guard against showing toasts in non-browser environments (SSR)
  if (typeof window === 'undefined') return;
  
  // Prevent duplicate errors if requested
  if (preventDuplicate) {
    // Simple deduplication strategy using a timestamp-based cache
    const errorKey = `${title}-${typedError.message}`;
    const now = Date.now();
    const lastShownTime = window.sessionStorage.getItem(errorKey);
    
    // Don't show the same error toast within 3 seconds
    if (lastShownTime && now - parseInt(lastShownTime, 10) < 3000) {
      return;
    }
    
    // Store the current time for this error
    window.sessionStorage.setItem(errorKey, now.toString());
  }
  
  // Show toast notification with appropriate details
  try {
    toast({
      title,
      description: userMessage || typedError.message,
      variant: "destructive",
      action: actionLabel && action ? (
        <ToastAction altText={actionLabel} onClick={action}>
          {actionLabel}
        </ToastAction>
      ) : undefined,
      // Auto-dismiss after 5 seconds for better UX
      duration: 5000,
    });
  } catch (toastError) {
    // Fallback to console error if toast fails
    console.error('Failed to show error toast:', toastError);
  }
}

/**
 * Utility to wrap functions with error handling
 * 
 * @param fn - The function to wrap with error handling
 * @param options - Error handling options
 * @returns A new function that runs the original but catches and handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    errorMessage?: string;
    fallbackValue?: ReturnType<T>;
    silent?: boolean;
    onError?: (error: unknown) => void;
    level?: ErrorLevel;
    context?: Record<string, any>;
    preventDuplicate?: boolean;
  } = {}
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      return fn(...args);
    } catch (error) {
      // Handle the error
      handleError(error, options.errorMessage, {
        silent: options.silent,
        level: options.level || 'error',
        context: options.context,
        preventDuplicate: options.preventDuplicate,
      });
      
      // Call custom error handler if provided
      if (options.onError) {
        options.onError(error);
      }
      
      // Return fallback value if provided
      return options.fallbackValue as ReturnType<T>;
    }
  };
}
