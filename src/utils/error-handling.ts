
import { toast } from "@/hooks/use-toast";

export type ErrorLevel = "info" | "warning" | "error" | "success";

interface ErrorOptions {
  level?: ErrorLevel;
  title?: string;
  actionLabel?: string;
  action?: () => void;
  technical?: boolean;
}

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
    title = "Error", 
    actionLabel,
    action,
    technical = false 
  } = options;
  
  // Always log the full error to the console for debugging
  console.error("Error caught:", error);
  
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
  
  // Display toast with appropriate styling
  toast({
    title,
    description: errorMessage,
    variant: level === "error" ? "destructive" : undefined,
    action: actionLabel && action ? {
      label: actionLabel,
      onClick: action
    } : undefined
  });
}

/**
 * Custom Error class for API-related errors
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

/**
 * Custom Error class for validation errors
 */
export class ValidationError extends Error {
  fields?: Record<string, string>;
  
  constructor(message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "ValidationError";
    this.fields = fields;
  }
}
