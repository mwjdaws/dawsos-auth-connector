
import { ErrorLevel, ErrorSource } from '../types';

/**
 * ApiError class for structured API errors
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly level: ErrorLevel;
  public readonly source: ErrorSource;
  public readonly context?: Record<string, any>;

  constructor(
    message: string, 
    statusCode: number = 500, 
    level: ErrorLevel = ErrorLevel.Error,
    source: ErrorSource = ErrorSource.API,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.level = level;
    this.source = source;
    this.context = context;
    
    // This is necessary for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Create a not found error
   */
  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(message, 404, ErrorLevel.Warning, ErrorSource.API);
  }
  
  /**
   * Create a bad request error
   */
  static badRequest(message: string = 'Bad request'): ApiError {
    return new ApiError(message, 400, ErrorLevel.Warning, ErrorSource.API);
  }
  
  /**
   * Create an unauthorized error
   */
  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(message, 401, ErrorLevel.Warning, ErrorSource.API);
  }
  
  /**
   * Create a forbidden error
   */
  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(message, 403, ErrorLevel.Warning, ErrorSource.API);
  }
  
  /**
   * Create a server error
   */
  static serverError(message: string = 'Internal server error'): ApiError {
    return new ApiError(message, 500, ErrorLevel.Error, ErrorSource.API);
  }
  
  /**
   * Create a timeout error
   */
  static timeout(message: string = 'Request timeout'): ApiError {
    return new ApiError(message, 408, ErrorLevel.Warning, ErrorSource.API);
  }
}

export default ApiError;
