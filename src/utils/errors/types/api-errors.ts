
import { ErrorSource } from '../types';

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
   * Status code if available
   */
  statusCode?: number;
  
  /**
   * Request data that caused the error
   */
  requestData?: Record<string, any>;
  
  /**
   * Constructor
   * 
   * @param message Error message
   * @param originalError Original error that was caught
   * @param statusCode HTTP status code if available
   * @param requestData Request data that caused the error
   */
  constructor(
    message: string, 
    originalError?: unknown,
    statusCode?: number,
    requestData?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
    this.originalError = originalError;
    this.statusCode = statusCode;
    this.requestData = requestData;
  }
}

/**
 * Error thrown when an API request fails for authorization reasons
 */
export class ApiAuthorizationError extends ApiError {
  constructor(message: string, originalError?: unknown, statusCode?: number) {
    super(message, originalError, statusCode || 401);
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
  /**
   * Timeout duration in milliseconds
   */
  timeoutMs: number;
  
  constructor(message: string, timeoutMs: number, originalError?: unknown) {
    super(message, originalError);
    this.name = 'ApiTimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Error thrown when rate limiting is encountered
 */
export class ApiRateLimitError extends ApiError {
  /**
   * When the rate limit will reset
   */
  resetTime?: Date;
  
  /**
   * Limit that was exceeded
   */
  limit?: number;
  
  constructor(
    message: string, 
    resetTime?: Date, 
    limit?: number, 
    originalError?: unknown
  ) {
    super(message, originalError, 429);
    this.name = 'ApiRateLimitError';
    this.resetTime = resetTime;
    this.limit = limit;
  }
}

/**
 * Create an API error instance
 */
export function createApiError(
  message: string,
  originalError?: unknown,
  statusCode?: number
): ApiError {
  // Handle specific HTTP status codes
  if (statusCode) {
    if (statusCode === 401 || statusCode === 403) {
      return new ApiAuthorizationError(message, originalError, statusCode);
    }
    
    if (statusCode === 429) {
      return new ApiRateLimitError(message, undefined, undefined, originalError);
    }
  }
  
  // Default to generic API error
  return new ApiError(message, originalError, statusCode);
}
