
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export type ErrorLevel = "info" | "warning" | "error" | "success";

interface ErrorOptions {
  level?: ErrorLevel;
  title?: string;
  actionLabel?: string;
  action?: () => void;
  technical?: boolean;
  silent?: boolean; // For errors that should be logged but not shown to user
  context?: Record<string, any>; // Additional context for logging/debugging
}

export enum ErrorCategory {
  AUTHENTICATION = "AUTHENTICATION",
  VALIDATION = "VALIDATION",
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  DATABASE = "DATABASE",
  API = "API",
  OPERATION = "OPERATION",
  TIMEOUT = "TIMEOUT",
  PERMISSION = "PERMISSION",
  UNKNOWN = "UNKNOWN"
}

/**
 * Categorizes an error based on its properties or message content
 */
function categorizeError(error: unknown): ErrorCategory {
  if (!error) return ErrorCategory.UNKNOWN;
  
  // For ApiError instances
  if (error instanceof ApiError) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      return ErrorCategory.AUTHENTICATION;
    }
    if (error.statusCode === 400) {
      return ErrorCategory.VALIDATION;
    }
    if (error.statusCode === 404) {
      return ErrorCategory.API;
    }
    if (error.statusCode >= 500) {
      return ErrorCategory.SERVER;
    }
    return ErrorCategory.API;
  }
  
  // For ValidationError instances
  if (error instanceof ValidationError) {
    return ErrorCategory.VALIDATION;
  }
  
  // For generic Error instances
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Authentication errors
    if (message.includes('auth') || 
        message.includes('login') || 
        message.includes('unauthorized') || 
        message.includes('unauthenticated') || 
        message.includes('permission') ||
        message.includes('forbidden')) {
      return ErrorCategory.AUTHENTICATION;
    }
    
    // Network errors
    if (message.includes('network') || 
        message.includes('connect') || 
        message.includes('offline') ||
        message.includes('cors')) {
      return ErrorCategory.NETWORK;
    }
    
    // Timeout errors
    if (message.includes('timeout') || 
        message.includes('timed out') || 
        error.name === 'AbortError') {
      return ErrorCategory.TIMEOUT;
    }
    
    // Validation errors
    if (message.includes('validation') || 
        message.includes('invalid') || 
        message.includes('required') ||
        message.includes('must be')) {
      return ErrorCategory.VALIDATION;
    }
    
    // Database errors
    if (message.includes('database') || 
        message.includes('db') || 
        message.includes('query') ||
        message.includes('sql')) {
      return ErrorCategory.DATABASE;
    }
  }
  
  // For Supabase error objects
  if (typeof error === 'object' && error !== null) {
    if ('code' in error) {
      const code = String(error.code);
      
      // Supabase PostgreSQL error codes
      if (code.startsWith('22') || code.startsWith('23')) {
        return ErrorCategory.DATABASE;
      }
      
      // Authentication error codes
      if (code === '401' || code === '403') {
        return ErrorCategory.AUTHENTICATION;
      }
    }
  }
  
  return ErrorCategory.UNKNOWN;
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
  
  // Display toast with appropriate styling
  toast({
    title,
    description: errorMessage,
    variant: level === "error" ? "destructive" : undefined,
    action: actionLabel && action ? (
      <ToastAction altText={actionLabel} onClick={action}>
        {actionLabel}
      </ToastAction>
    ) : undefined
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

/**
 * Custom Error class for network-related errors
 */
export class NetworkError extends Error {
  retryable: boolean;
  
  constructor(message: string, retryable = true) {
    super(message);
    this.name = "NetworkError";
    this.retryable = retryable;
  }
}

/**
 * Custom Error class for authentication errors
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Custom Error class for database errors
 */
export class DatabaseError extends Error {
  code?: string;
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = "DatabaseError";
    this.code = code;
  }
}

/**
 * Wrap an async function with standardized error handling
 * @param fn The async function to wrap
 * @param defaultErrorMessage The default error message to show
 * @param options Error handling options
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  defaultErrorMessage = "An error occurred",
  options: ErrorOptions = {}
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, defaultErrorMessage, options);
    return null;
  }
}
