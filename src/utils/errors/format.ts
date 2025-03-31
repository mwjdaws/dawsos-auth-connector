
/**
 * Error formatting utilities
 */

/**
 * Format any error into a standard Error object
 */
export function formatError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  if (error === null) {
    return new Error('Null error');
  }
  
  if (error === undefined) {
    return new Error('Undefined error');
  }
  
  if (typeof error === 'object') {
    try {
      const message = JSON.stringify(error);
      return new Error(message);
    } catch {
      return new Error(`Object error: ${Object.prototype.toString.call(error)}`);
    }
  }
  
  return new Error(`Unknown error: ${String(error)}`);
}
