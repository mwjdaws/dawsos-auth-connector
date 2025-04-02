
import { ErrorSource } from './index';

/**
 * Error thrown by API operations
 */
export class ApiError extends Error {
  /**
   * The source of the error
   */
  source = ErrorSource.API;
  
  /**
   * Original error that was caught
   */
  originalError?: unknown;
  
  /**
   * Constructor
   * 
   * @param message Error message
   * @param originalError Original error that was caught
   */
  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.originalError = originalError;
  }
}

/**
 * Error thrown when an API request fails for authorization reasons
 */
export class ApiAuthorizationError extends ApiError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError);
    this.name = 'ApiAuthorizationError';
  }
}

/**
 * Error thrown when an API request fails due to network issues
 */
export class ApiNetworkError extends ApiError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError);
    this.name = 'ApiNetworkError';
  }
}

/**
 * Error thrown when an API request times out
 */
export class ApiTimeoutError extends ApiError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError);
    this.name = 'ApiTimeoutError';
  }
}
