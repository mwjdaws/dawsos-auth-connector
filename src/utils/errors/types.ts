
/**
 * Options for error handling customization
 */
export interface ErrorHandlingOptions {
  /**
   * Additional context to include with the error
   */
  context?: Record<string, any>;
  
  /**
   * Logging level for the error
   */
  level?: 'error' | 'warning' | 'info' | 'debug';
  
  /**
   * Label for the action button (if any)
   */
  actionLabel?: string;
  
  /**
   * Function to execute when the action button is clicked
   */
  action?: () => void | Promise<void>;
  
  /**
   * Whether to show technical details in the UI
   */
  technical?: boolean;
  
  /**
   * Whether to suppress UI notifications
   */
  silent?: boolean;
  
  /**
   * Custom title for error notifications
   */
  title?: string;
}

// Alias for backward compatibility
export type ErrorOptions = ErrorHandlingOptions;

/**
 * Base custom error class
 */
export class BaseError extends Error {
  code?: string | number;
  
  constructor(message: string, code?: string | number) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    
    // This is needed because extending built-in classes in TypeScript can
    // have issues with the prototype chain
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

/**
 * Error for validation failures
 */
export class ValidationError extends BaseError {
  constructor(message: string, code?: string | number) {
    super(message, code || 'VALIDATION_ERROR');
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error for API-related failures
 */
export class ApiError extends BaseError {
  status?: number;
  
  constructor(message: string, status?: number, code?: string | number) {
    super(message, code || 'API_ERROR');
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Error for database operations
 */
export class DatabaseError extends BaseError {
  constructor(message: string, code?: string | number) {
    super(message, code || 'DATABASE_ERROR');
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Error for authentication issues
 */
export class AuthError extends BaseError {
  constructor(message: string, code?: string | number) {
    super(message, code || 'AUTH_ERROR');
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
