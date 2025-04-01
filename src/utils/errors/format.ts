
import { ErrorHandlingOptions } from './types';

/**
 * Format an error message for display to users
 * 
 * @param error The error object
 * @param userMessage Optional user-friendly message
 * @param options Error handling options
 * @returns A formatted string for display
 */
export function formatErrorForDisplay(
  error: Error,
  userMessage?: string,
  options?: Partial<ErrorHandlingOptions>
): string {
  // If a user message is provided, use it
  if (userMessage) {
    return userMessage;
  }

  // If technical details are enabled and available, use them
  if (options?.technical) {
    return options.technical;
  }

  // Use the error's message
  return error.message;
}

/**
 * Format a stack trace for logging purposes
 * 
 * @param error The error object
 * @returns A formatted stack trace
 */
export function formatStackTrace(error: Error): string {
  if (!error.stack) {
    return 'No stack trace available';
  }

  // Clean up the stack trace for better readability
  return error.stack
    .split('\n')
    .map(line => line.trim())
    .join('\n');
}

/**
 * Format error for debugging purposes
 * 
 * @param error The error object
 * @param options Error handling options
 * @returns A debug-friendly string representation
 */
export function formatErrorForDebug(
  error: Error,
  options?: Partial<ErrorHandlingOptions>
): string {
  const parts = [
    `Error: ${error.message}`,
    `Source: ${options?.source || 'unknown'}`,
    `Type: ${error.name}`,
  ];

  if (error.stack) {
    parts.push(`Stack: ${formatStackTrace(error)}`);
  }

  if (options?.context) {
    parts.push(`Context: ${JSON.stringify(options.context)}`);
  }

  return parts.join('\n');
}
