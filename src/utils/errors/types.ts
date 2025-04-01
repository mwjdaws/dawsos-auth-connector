
/**
 * Error level enumeration
 */
export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',   // Correct capitalization
  Error = 'error',
  Critical = 'critical'
}

/**
 * Error source enumeration
 */
export enum ErrorSource {
  Unknown = 'unknown',
  User = 'user',
  App = 'app',
  API = 'api',         // Correct capitalization
  Database = 'database',
  Network = 'network',
  Auth = 'auth',
  Utils = 'utils',
  Component = 'component',
  Hook = 'hook',
  Service = 'service'
}

/**
 * Base validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  resultType?: string;
}

/**
 * Content ID validation result 
 */
export interface ContentIdValidationResult extends ValidationResult {
  contentExists?: boolean;
  resultType: 'contentId';
}

/**
 * Tag validation result
 */
export interface TagValidationResult extends ValidationResult {
  resultType: 'tag';
}

/**
 * Create a validation result with default values
 */
export function createValidationResult(
  isValid: boolean, 
  errorMessage: string | null = null,
  resultType?: string
): ValidationResult {
  return {
    isValid,
    errorMessage,
    resultType
  };
}

/**
 * Create a content ID validation result
 */
export function createContentIdValidationResult(
  isValid: boolean,
  errorMessage: string | null = null,
  contentExists = false
): ContentIdValidationResult {
  return {
    isValid,
    errorMessage,
    contentExists,
    resultType: 'contentId'
  };
}

/**
 * Create a tag validation result
 */
export function createTagValidationResult(
  isValid: boolean,
  errorMessage: string | null = null
): TagValidationResult {
  return {
    isValid,
    errorMessage,
    resultType: 'tag'
  };
}

/**
 * Error handling options
 */
export interface ErrorHandlingOptions {
  source: ErrorSource;
  level: ErrorLevel;
  context?: Record<string, any>;
  message: string;
  silent?: boolean;
  showToast?: boolean;
  reportToAnalytics?: boolean;
}

/**
 * Creates a failed validation result
 */
export function createInvalidResult(
  errorMessage: string,
  resultType?: string
): ValidationResult {
  return createValidationResult(false, errorMessage, resultType);
}

/**
 * Creates a successful validation result
 */
export function createValidResult(resultType?: string): ValidationResult {
  return createValidationResult(true, null, resultType);
}

// Add ontology term validation result
export interface OntologyTermValidationResult extends ValidationResult {
  resultType: 'ontologyTerm';
}

// Add document validation result
export interface DocumentValidationResult extends ValidationResult {
  resultType: 'document';
}

// Add creator functions
export function createOntologyTermValidationResult(
  isValid: boolean,
  errorMessage: string | null = null
): OntologyTermValidationResult {
  return {
    isValid,
    errorMessage,
    resultType: 'ontologyTerm'
  };
}

export function createDocumentValidationResult(
  isValid: boolean,
  errorMessage: string | null = null
): DocumentValidationResult {
  return {
    isValid,
    errorMessage,
    resultType: 'document'
  };
}
