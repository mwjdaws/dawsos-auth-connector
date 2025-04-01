
/**
 * Error levels for categorization 
 */
export enum ErrorLevel {
  // Lower severity, typically for debugging
  Debug = 'debug',
  
  // Informational errors that don't require immediate attention
  Info = 'info',
  
  // Issues that should be addressed but don't break functionality
  Warning = 'warning',
  
  // Critical errors that break functionality
  Error = 'error',
  
  // Legacy values for backward compatibility
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

/**
 * Sources of errors for better categorization
 */
export enum ErrorSource {
  // Application logic errors
  App = 'app',
  
  // UI component errors
  UI = 'ui',
  
  // API-related errors
  API = 'api',
  
  // Database errors
  Database = 'database',
  
  // Authentication errors
  Auth = 'auth',
  
  // Validation errors
  Validation = 'validation',
  
  // Network errors
  Network = 'network',
  
  // Server errors
  Server = 'server',
  
  // Utility function errors
  Utils = 'utils',
  
  // Legacy references for backward compatibility
  APP = 'app',
  DATABASE = 'database',
  API = 'api',
  Util = 'utils',
  Api = 'api',
  AUTH = 'auth'
}

/**
 * Error handling options interface
 */
export interface ErrorHandlingOptions {
  // Error severity level
  level?: ErrorLevel;
  
  // Source of the error
  source?: ErrorSource;
  
  // Custom error message
  message?: string;
  
  // Whether to report to analytics
  reportToAnalytics?: boolean;
  
  // Whether to show a toast notification
  showToast?: boolean;
  
  // Whether to suppress all output
  silent?: boolean;
  
  // Additional context for the error
  context?: Record<string, any>;
  
  // Optional toast ID for updating existing toasts
  toastId?: string;
  
  // Unique identifier for error deduplication
  fingerprint?: string;
  
  // Whether this is a technical error (not user-facing)
  technical?: boolean;
  
  // Whether to suppress toast notifications
  suppressToast?: boolean;
  
  // Original error object if wrapping another error
  originalError?: any;
}

/**
 * Default error options
 */
export const defaultErrorOptions: ErrorHandlingOptions = {
  level: ErrorLevel.Error,
  source: ErrorSource.App,
  reportToAnalytics: true,
  showToast: true,
  silent: false
};

/**
 * Base validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message: string | null;
  resultType: string;
  contentExists?: boolean;
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult extends ValidationResult {
  resultType: 'contentId';
  contentExists: boolean;
}

/**
 * Document content validation result
 */
export interface DocumentValidationResult extends ValidationResult {
  resultType: 'document';
}

/**
 * Tag validation result
 */
export interface TagValidationResult extends ValidationResult {
  resultType: 'tag';
}

/**
 * Ontology term validation result
 */
export interface OntologyTermValidationResult extends ValidationResult {
  resultType: 'ontologyTerm';
}
