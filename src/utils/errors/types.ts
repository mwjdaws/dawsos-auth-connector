
/**
 * Type definitions for error handling utilities
 */

// Error codes for different error types
export enum ErrorCode {
  // General errors
  UNKNOWN = 'UNKNOWN',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  TIMEOUT = 'TIMEOUT',
  NETWORK = 'NETWORK',
  
  // Auth errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // Data errors
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  CONFLICT = 'CONFLICT',
  
  // API errors
  BAD_REQUEST = 'BAD_REQUEST',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // App-specific errors
  KNOWLEDGE_SOURCE_ERROR = 'KNOWLEDGE_SOURCE_ERROR',
  TEMPLATE_ERROR = 'TEMPLATE_ERROR',
  METADATA_ERROR = 'METADATA_ERROR',
  TAG_ERROR = 'TAG_ERROR',
  ENRICHMENT_ERROR = 'ENRICHMENT_ERROR'
}

// Base error interface
export interface AppError extends Error {
  code: ErrorCode | string;
  originalError?: Error;
  details?: Record<string, any>;
  isOperational?: boolean;
}

// API-specific error
export interface ApiError extends AppError {
  statusCode?: number;
  endpoint?: string;
  method?: string;
  params?: Record<string, any>;
}

// Validation error
export interface ValidationError extends AppError {
  field?: string;
  invalidValue?: any;
}

// Network error
export interface NetworkError extends AppError {
  isOffline?: boolean;
  requestId?: string;
}

// Database error
export interface DatabaseError extends AppError {
  table?: string;
  operation?: string;
  records?: any[];
}

// Error handling options
export interface ErrorHandlingOptions {
  errorMessage?: string;
  context?: Record<string, any>;
  showToast?: boolean;
  logError?: boolean;
  severity?: 'info' | 'warning' | 'error';
  rethrow?: boolean;
}

export interface ErrorHandlingCompatOptions extends ErrorHandlingOptions {
  toastVariant?: 'default' | 'destructive';
}

// Error handling function signature
export type ErrorHandler = (error: Error | unknown, options?: ErrorHandlingOptions) => void;
