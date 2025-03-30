
import { StandardizedError } from './types';

/**
 * Gets a user-friendly error message from an error object
 */
export function getErrorMessage(error: unknown): string {
  if (!error) {
    return 'An unknown error occurred';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message || 'An error occurred';
  }

  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Formats an error for display in logs or UI
 */
export function formatError(error: StandardizedError): string {
  const timestamp = error.timestamp ? new Date(error.timestamp).toISOString() : new Date().toISOString();
  const source = error.source ? ` [${error.source}]` : '';
  const code = error.code ? ` (${error.code})` : '';
  
  return `[${timestamp}]${source}${code}: ${error.message}`;
}

/**
 * Creates a formatted technical error message with stack trace if available
 */
export function formatTechnicalError(error: StandardizedError): string {
  const basic = formatError(error);
  const stack = error.stack ? `\n${error.stack}` : '';
  
  return `${basic}${stack}`;
}

/**
 * Format validation errors for user feedback
 */
export function formatValidationError(field: string, message: string): string {
  return `${field}: ${message}`;
}

/**
 * Format API errors for display
 */
export function formatApiError(error: unknown): string {
  const baseMessage = getErrorMessage(error);
  
  if (typeof error === 'object' && error !== null) {
    const statusCode = 'statusCode' in error ? ` (${error.statusCode})` : '';
    const endpoint = 'endpoint' in error ? ` [${error.endpoint}]` : '';
    return `API Error${statusCode}${endpoint}: ${baseMessage}`;
  }
  
  return `API Error: ${baseMessage}`;
}
