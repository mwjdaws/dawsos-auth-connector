
/**
 * Error handling type definitions
 */

// Error severity levels
export enum ErrorLevel {
  DEBUG = "debug",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error"
}

// Error sources (where the error originated)
export enum ErrorSource {
  CLIENT = "client",
  SERVER = "server",
  NETWORK = "network",
  DATABASE = "database",
  UNKNOWN = "unknown"
}

// Core validation result interface
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message: string | null;
  resultType: string;
}

// Error handling options
export interface ErrorHandlingOptions {
  // Error categorization
  level: ErrorLevel;
  source?: ErrorSource;
  
  // Context information
  context?: Record<string, any>;
  technical?: string;
  fingerprint?: string;
  
  // Display/reporting options
  silent?: boolean;
  reportToAnalytics?: boolean;
  showToast?: boolean;
  toastTitle?: string;
  toastId?: string;
  
  // Error details
  code?: string;
  message?: string;
}

// Default error handling options
export const defaultErrorOptions: ErrorHandlingOptions = {
  level: ErrorLevel.ERROR,
  context: {},
  silent: false,
  reportToAnalytics: true,
  showToast: true
};

// API Error type
export interface ApiError extends Error {
  status?: number;
  code?: string;
  context?: Record<string, any>;
}
