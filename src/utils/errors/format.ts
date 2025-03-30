
import type { StandardizedError } from './types';

/**
 * Format an error object to a standardized format
 * @param error The error to format
 * @returns Standardized error message
 */
export function formatErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
}

/**
 * Format an error object to a user-friendly message
 * @param error The error to format
 * @returns User-friendly error message
 */
export function formatUserErrorMessage(error: StandardizedError): string {
  // Return user-friendly message if available
  if (error.userMessage) {
    return error.userMessage;
  }
  
  // Return the technical message as fallback
  return error.message;
}
