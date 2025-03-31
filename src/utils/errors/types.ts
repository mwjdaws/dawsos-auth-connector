
/**
 * Standard error levels
 */
export type ErrorLevel = "debug" | "info" | "warning" | "error";

/**
 * Compatible error handling options
 */
export interface ErrorHandlingCompatOptions {
  errorMessage?: string;
  level?: ErrorLevel;
  context?: Record<string, any>;
  
  // Additional options for backward compatibility
  silent?: boolean;
  technical?: boolean;
  actionLabel?: string;
  onRetry?: () => void;
  preventDuplicate?: boolean;
  deduplicate?: boolean;
  duration?: number;
}

/**
 * API error structure
 */
export interface ApiError extends Error {
  name: string;
  message: string;
  stack: string;
  level: "error";
  statusCode: number;
  endpoint: string;
  responseData: any;
  timestamp: number;
}

/**
 * Validation error structure
 */
export interface ValidationError extends Error {
  name: string;
  message: string;
  stack: string;
  level: "warning";
  field: string;
  value: any;
  timestamp: number;
}

/**
 * Generic application error structure
 */
export interface ApplicationError extends Error {
  name: string;
  message: string;
  stack: string;
  level: ErrorLevel;
  context?: Record<string, any>;
  timestamp: number;
}

/**
 * Standardized error type
 */
export type StandardizedError = ApiError | ValidationError | ApplicationError;

/**
 * Type for withErrorHandling function
 */
export type WrappableFunction<T> = (...args: any[]) => Promise<T>;

/**
 * Type for error handling options
 */
export type WithErrorHandlingOptions = ErrorHandlingCompatOptions;

/**
 * Result of validation
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage: string | null;
}
