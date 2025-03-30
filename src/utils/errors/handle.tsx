
import { toast } from "@/hooks/use-toast";
import { categorizeError } from "./categorize";
import { ErrorHandlingOptions } from "./types";
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
    action: actionLabel && action ? (
      <ToastAction altText={actionLabel} onClick={action}>
        {actionLabel}
      </ToastAction>
    ) : undefined
  });
}
