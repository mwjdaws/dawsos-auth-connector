
// Re-export all error handling functionality
// This maintains backward compatibility while we transition to a modular approach
export * from './errors/types';
export * from './errors/categorize';
export * from './errors/handle';
export * from './errors/wrappers';

// For backward compatibility, we still provide the original API
import { handleError as internalHandleError } from './errors/handle';
import { ErrorHandlingOptions } from './errors/types';

/**
 * @deprecated Use the imported handleError from './errors/handle' instead
 */
export function handleError(
  error: unknown,
  userMessage?: string,
  options?: ErrorHandlingOptions
): void {
  // Simply pass through to the new implementation
  internalHandleError(error, userMessage, options);
}
