
/**
 * Error deduplication utilities
 */
import { ErrorHandlingOptions } from './types';
import { generateErrorFingerprint } from './generateId';

// Store seen error fingerprints
const seenErrors = new Set<string>();

/**
 * Check if an error has been seen before
 * 
 * @param error The error to check
 * @param options Additional options
 * @returns Whether the error has been seen before
 */
export function hasErrorBeenSeen(
  error: Error,
  options?: Partial<ErrorHandlingOptions>
): boolean {
  const fingerprint = options?.fingerprint || generateErrorFingerprint(error, options?.context);
  return seenErrors.has(fingerprint);
}

/**
 * Mark an error as seen to prevent duplicate reporting
 * 
 * @param error The error to mark as seen
 * @param options Additional options
 * @returns The error (for chaining)
 */
export function deduplicateError(
  error: Error,
  options?: Partial<ErrorHandlingOptions>
): Error {
  const fingerprint = options?.fingerprint || generateErrorFingerprint(error, options?.context);
  seenErrors.add(fingerprint);
  return error;
}

/**
 * Clear the set of seen errors
 * This is useful for testing or when context changes
 */
export function clearSeenErrors(): void {
  seenErrors.clear();
}
