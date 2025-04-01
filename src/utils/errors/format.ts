
import { ErrorLevel, ErrorContext, ErrorMetadata } from './types';
import { compatibleErrorOptions } from '../compatibility';

/**
 * Formats an error object for consistent handling throughout the app
 * 
 * @param error The original error
 * @param message User-friendly message
 * @param options Additional options for error handling
 * @returns Formatted error metadata object
 */
export function formatError(
  error: unknown, 
  message: string = 'An error occurred',
  options: Partial<{
    level: ErrorLevel;
    context: ErrorContext;
    technical: boolean; // For backward compatibility
  }> = {}
): ErrorMetadata {
  // Handle compatibility options
  const compatOptions = compatibleErrorOptions(options);
  const level = compatOptions.level || ErrorLevel.ERROR;
  
  // Extract original error message if available
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string'
      ? error
      : typeof error === 'object' && error !== null
        ? JSON.stringify(error)
        : 'Unknown error';

  // Get stack trace if available
  const stack = error instanceof Error ? error.stack : undefined;
  
  // Generate a unique fingerprint for deduplication
  const fingerprint = generateErrorFingerprint(error, message);
  
  // Determine if this should be shown to the user
  const isUserVisible = level === ErrorLevel.ERROR || level === ErrorLevel.CRITICAL;
  
  return {
    timestamp: Date.now(),
    level,
    context: {
      ...compatOptions.context
    },
    fingerprint,
    stack,
    isUserVisible,
    message: message || errorMessage,
    originalError: error,
    code: error instanceof Error && 'code' in error ? (error as any).code : undefined
  };
}

/**
 * Generates a unique fingerprint for an error to help with deduplication
 * 
 * @param error The original error
 * @param message The error message
 * @returns A string fingerprint
 */
function generateErrorFingerprint(error: unknown, message: string): string {
  // Extract the most useful part of the stack trace for fingerprinting
  let stackSignature = '';
  if (error instanceof Error && error.stack) {
    // Get first 3 lines of stack trace
    stackSignature = error.stack.split('\n').slice(0, 3).join('');
  }
  
  // Create fingerprint from error message and stack
  const baseString = `${message}|${error instanceof Error ? error.message : ''}|${stackSignature}`;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit int
  }
  
  return `err_${Math.abs(hash).toString(16)}`;
}
