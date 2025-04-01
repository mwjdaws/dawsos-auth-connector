
/**
 * Utility to generate unique error IDs
 */

/**
 * Generate a unique error ID
 */
export function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a fingerprint for error deduplication
 */
export function generateErrorFingerprint(error: Error, context?: Record<string, any>): string {
  const errorName = error.name || 'UnknownError';
  const errorMessage = error.message || '';
  const contextStr = context ? JSON.stringify(context) : '';
  
  return `${errorName}_${errorMessage.substring(0, 50)}_${contextStr.substring(0, 50)}`;
}
