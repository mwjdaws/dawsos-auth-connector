
/**
 * Generate a unique ID for errors
 * 
 * This is useful for tracking errors in logs and relating them to UI notifications
 */
export function generateErrorId(): string {
  return `error-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generate a unique ID for deduplicated errors
 * 
 * This creates a consistent ID based on the error type and message,
 * which allows for deduplication of similar errors
 */
export function generateDeduplicatedErrorId(type: string, message: string): string {
  // Create a simple hash of the message
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    hash = ((hash << 5) - hash) + message.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return `${type}-${Math.abs(hash).toString(16)}`;
}

/**
 * Generate a unique ID for validation errors
 */
export function generateValidationErrorId(fieldName: string): string {
  return `validation-${fieldName}-${Date.now()}`;
}
