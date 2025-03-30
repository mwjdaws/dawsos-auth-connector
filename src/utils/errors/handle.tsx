
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ErrorOptions, ErrorCategory } from './types';
import { categorizeError } from './categorize';

/**
 * Standardized error handling utility that logs errors and displays appropriate UI feedback
 * @param error The error object or message
 * @param message Optional user-friendly message to display
 * @param options Additional configuration options
 */
export function handleError(
  error: unknown,
  message = "An unexpected error occurred",
  options: ErrorOptions = {}
): void {
  const { 
    level = "error", 
    title = level === "error" ? "Error" : level === "warning" ? "Warning" : level === "info" ? "Notice" : "Success", 
    actionLabel,
    action,
    technical = false,
    silent = false,
    context = {}
  } = options;
  
  // Always log the full error to the console for debugging
  console.error("Error caught:", error);
  if (Object.keys(context).length > 0) {
    console.error("Error context:", context);
  }
  
  // Categorize the error
  const category = categorizeError(error);
  console.error(`Error category: ${category}`);
  
  // Extract error message based on error type
  let errorMessage = message;
  if (error instanceof Error) {
    errorMessage = technical ? error.message : message;
    
    // Log stack trace for debugging
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
  } else if (typeof error === "string") {
    errorMessage = technical ? error : message;
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = technical ? (error.message as string) : message;
  }
  
  // Don't show toast if silent mode is enabled
  if (silent) return;
  
  // Map level to variant for toast
  const variantMap: Record<string, "default" | "destructive"> = {
    "error": "destructive",
    "warning": "default",
    "info": "default",
    "success": "default"
  };
  
  // Display toast with appropriate styling
  toast({
    title,
    description: errorMessage,
    variant: variantMap[level],
    action: actionLabel && action ? (
      <ToastAction altText={actionLabel} onClick={action}>
        {actionLabel}
      </ToastAction>
    ) : undefined
  });
}
