
/**
 * Utility to generate unique error IDs and fingerprints
 */

/**
 * Generate a unique error ID
 */
export function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a fingerprint for error deduplication
 * 
 * @param error The error to generate a fingerprint for
 * @param context Additional context to include in the fingerprint
 * @returns A fingerprint string that can be used to identify duplicate errors
 */
export function generateErrorFingerprint(error: Error, context?: Record<string, any>): string {
  const errorName = error.name || 'UnknownError';
  const errorMessage = error.message || '';
  const errorStack = error.stack?.split('\n')[1] || '';
  const contextStr = context ? JSON.stringify(context) : '';
  
  // Create a fingerprint using the most distinctive parts of the error
  return `${errorName}_${errorMessage.substring(0, 50)}_${errorStack.substring(0, 50)}_${contextStr.substring(0, 30)}`;
}

/**
 * Generate a short ID for use in temporary references
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 9);
}
