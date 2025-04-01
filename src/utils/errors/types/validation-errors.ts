
import { ErrorLevel, ErrorSource } from '../types';

/**
 * ValidationError class for structured validation errors
 */
export class ValidationError extends Error {
  public readonly field?: string;
  public readonly level: ErrorLevel;
  public readonly source: ErrorSource;
  public readonly context?: Record<string, any>;

  constructor(
    message: string, 
    field?: string,
    level: ErrorLevel = ErrorLevel.Warning,
    source: ErrorSource = ErrorSource.User,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.level = level;
    this.source = source;
    this.context = context;
    
    // This is necessary for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  /**
   * Create a required field error
   */
  static required(field: string): ValidationError {
    return new ValidationError(`${field} is required`, field);
  }
  
  /**
   * Create an invalid format error
   */
  static invalidFormat(field: string, format: string): ValidationError {
    return new ValidationError(`${field} must be a valid ${format}`, field);
  }
  
  /**
   * Create a min length error
   */
  static minLength(field: string, length: number): ValidationError {
    return new ValidationError(`${field} must be at least ${length} characters`, field);
  }
  
  /**
   * Create a max length error
   */
  static maxLength(field: string, length: number): ValidationError {
    return new ValidationError(`${field} cannot exceed ${length} characters`, field);
  }
  
  /**
   * Create a numeric range error
   */
  static range(field: string, min: number, max: number): ValidationError {
    return new ValidationError(`${field} must be between ${min} and ${max}`, field);
  }
}

export default ValidationError;
