
/**
 * Error handling types and configurations
 */

// Error severity levels
export type ErrorLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

// Error handling options
export interface ErrorOptions {
  // The severity level of the error
  level: ErrorLevel;
  
  // Whether the error is technical (for developers) or user-facing
  technical: boolean;
  
  // Additional context for the error
  context?: Record<string, any>;
  
  // ID for deduplication purposes
  deduplicationId?: string;
  
  // Whether to deduplicate similar errors
  deduplicate?: boolean;
  
  // Whether to suppress notifications
  silent?: boolean;
  
  // Content ID if error is related to specific content
  contentId?: string;
  
  // Category of the error (e.g., 'validation', 'network')
  category?: string;
}

// Compatibility types for older error handling
export interface ErrorHandlingCompatOptions {
  errorMessage?: string;
  silent?: boolean;
  level?: ErrorLevel;
  category?: string;
  technical?: boolean;
  context?: Record<string, any>;
  deduplicate?: boolean;
}

/**
 * Custom error classes
 */

// Base class for application errors
export class AppError extends Error {
  level: ErrorLevel;
  
  constructor(message: string, level: ErrorLevel = 'error') {
    super(message);
    this.name = 'AppError';
    this.level = level;
  }
}

// Validation error
export class ValidationError extends AppError {
  field?: string;
  
  constructor(message: string, field?: string) {
    super(message, 'warning');
    this.name = 'ValidationError';
    this.field = field;
  }
}

// API error
export class ApiError extends AppError {
  status: number;
  
  constructor(message: string, status: number = 500) {
    const level = status >= 500 ? 'error' : 'warning';
    super(message, level);
    this.name = 'ApiError';
    this.status = status;
  }
}
