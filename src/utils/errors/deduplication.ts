
import { ErrorHandlingOptions } from './types';

// Error storage for deduplication
const reportedErrors = new Set<string>();

/**
 * Generate a fingerprint for an error based on its details
 * 
 * @param error The error to generate a fingerprint for
 * @param options Additional options
 * @returns A string fingerprint uniquely identifying the error
 */
function generateFingerprint(error: Error, options?: Partial<ErrorHandlingOptions>): string {
  // Start with the error message and name
  let parts = [error.name, error.message];

  // Add the source if available
  if (options?.source) {
    parts.push(String(options.source));
  }

  // Add the first line of stack trace if available (excluding the message part)
  if (error.stack) {
    const stackLines = error.stack.split('\n');
    if (stackLines.length > 1) {
      parts.push(stackLines[1].trim());
    }
  }

  // Join and hash the parts to create a fingerprint
  return parts.join('|');
}

/**
 * Check if an error has been reported before
 * 
 * @param error The error to check
 * @param options Additional options that may affect fingerprinting
 * @returns True if the error has been reported, false otherwise
 */
export function hasErrorBeenReported(error: Error, options?: Partial<ErrorHandlingOptions>): boolean {
  // Use the provided fingerprint or generate one
  const fingerprint = options?.fingerprint || generateFingerprint(error, options);
  return reportedErrors.has(fingerprint);
}

/**
 * Mark an error as reported to prevent duplicate reports
 * 
 * @param error The error to deduplicate
 * @param options Additional options that may affect fingerprinting
 * @returns The error object (for chaining)
 */
export function deduplicateError(error: Error, options?: Partial<ErrorHandlingOptions>): Error {
  // Use the provided fingerprint or generate one
  const fingerprint = options?.fingerprint || generateFingerprint(error, options);
  reportedErrors.add(fingerprint);
  return error;
}

/**
 * Clear the set of reported errors
 * Useful for testing or when changing contexts
 */
export function clearReportedErrors(): void {
  reportedErrors.clear();
}
