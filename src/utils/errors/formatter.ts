
import { ErrorLevel, ErrorSource } from './types';

/**
 * Format error for logging to console or analytics
 */
export function formatErrorForLogging(
  error: Error,
  options: {
    level?: ErrorLevel;
    source?: ErrorSource;
    context?: Record<string, any>;
    fingerprint?: string;
  }
): Record<string, any> {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    level: options.level || ErrorLevel.Error,
    source: options.source || ErrorSource.Unknown,
    context: options.context || {},
    fingerprint: options.fingerprint,
    timestamp: new Date().toISOString()
  };
}

/**
 * Format error for user-facing display
 */
export function formatErrorForUser(
  error: Error,
  customMessage?: string,
  occurrenceCount?: number
): string {
  // Use custom message if provided, otherwise use error message
  let message = customMessage || error.message;
  
  // Handle duplicate occurrences
  if (occurrenceCount && occurrenceCount > 1) {
    message = `${message} (${occurrenceCount}x)`;
  }
  
  return message;
}

/**
 * Format technical error details for developers
 */
export function formatTechnicalError(
  error: Error,
  context?: Record<string, any>
): string {
  const parts = [
    `Error: ${error.message}`,
    context ? `Context: ${JSON.stringify(context, null, 2)}` : '',
    `Stack: ${error.stack}`,
  ].filter(Boolean);
  
  return parts.join('\n');
}

/**
 * Get error name from any type
 */
export function getErrorName(error: any): string {
  if (!error) {
    return 'Unknown Error';
  }
  
  if (typeof error === 'string') {
    return 'Error';
  }
  
  if (error instanceof Error) {
    return error.name || 'Error';
  }
  
  if (typeof error === 'object') {
    return error.name || error.constructor?.name || 'Object Error';
  }
  
  return 'Unknown Error';
}
