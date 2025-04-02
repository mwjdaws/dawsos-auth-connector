
import { ErrorSource } from '../types';

/**
 * Base validation error class
 */
export class ValidationError extends Error {
  /**
   * The field that failed validation
   */
  fieldName: string;
  
  /**
   * The value that failed validation
   */
  value: any;
  
  /**
   * Code for specific validation failure
   */
  code: string;
  
  /**
   * Error source
   */
  source = ErrorSource.Validation;
  
  /**
   * Additional context information
   */
  context?: Record<string, any>;

  constructor(
    message: string,
    fieldName: string,
    value: any,
    code = 'VALIDATION_ERROR',
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ValidationError';
    this.fieldName = fieldName;
    this.value = value;
    this.code = code;
    this.context = context;
  }
}

/**
 * Error for required field validation failures
 */
export class RequiredFieldError extends ValidationError {
  constructor(fieldName: string, context?: Record<string, any>) {
    super(
      `${fieldName} is required`,
      fieldName,
      undefined,
      'REQUIRED_FIELD',
      context
    );
    this.name = 'RequiredFieldError';
  }
}

/**
 * Error for invalid type validation failures
 */
export class TypeValidationError extends ValidationError {
  /**
   * The expected type
   */
  expectedType: string;

  constructor(
    fieldName: string,
    value: any,
    expectedType: string,
    context?: Record<string, any>
  ) {
    super(
      `${fieldName} should be of type ${expectedType}`,
      fieldName,
      value,
      'TYPE_VALIDATION',
      context
    );
    this.name = 'TypeValidationError';
    this.expectedType = expectedType;
  }
}

/**
 * Error for format validation failures
 */
export class FormatValidationError extends ValidationError {
  /**
   * The expected format
   */
  expectedFormat: string;

  constructor(
    fieldName: string,
    value: any,
    expectedFormat: string,
    context?: Record<string, any>
  ) {
    super(
      `${fieldName} must match format: ${expectedFormat}`,
      fieldName,
      value,
      'FORMAT_VALIDATION',
      context
    );
    this.name = 'FormatValidationError';
    this.expectedFormat = expectedFormat;
  }
}

/**
 * Error for range validation failures
 */
export class RangeValidationError extends ValidationError {
  /**
   * Minimum value
   */
  min?: number;
  
  /**
   * Maximum value
   */
  max?: number;

  constructor(
    fieldName: string,
    value: any,
    min?: number,
    max?: number,
    context?: Record<string, any>
  ) {
    const rangeText = min !== undefined && max !== undefined
      ? `between ${min} and ${max}`
      : min !== undefined
        ? `at least ${min}`
        : `at most ${max}`;
        
    super(
      `${fieldName} must be ${rangeText}`,
      fieldName,
      value,
      'RANGE_VALIDATION',
      context
    );
    this.name = 'RangeValidationError';
    this.min = min;
    this.max = max;
  }
}

/**
 * Create a validation error
 */
export function createValidationError(
  message: string,
  fieldName: string,
  value: any,
  code = 'VALIDATION_ERROR',
  context?: Record<string, any>
): ValidationError {
  return new ValidationError(message, fieldName, value, code, context);
}
