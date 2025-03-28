
/**
 * Error handling type definitions
 */

export type ErrorLevel = "info" | "warning" | "error" | "success";

export interface ErrorOptions {
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
