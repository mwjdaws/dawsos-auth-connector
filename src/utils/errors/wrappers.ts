
import { handleError } from './handle';
import { ErrorOptions } from './types';

/**
 * Wrap an async function with standardized error handling
 * @param fn The async function to wrap
 * @param defaultErrorMessage The default error message to show
 * @param options Error handling options
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  defaultErrorMessage = "An error occurred",
  options: ErrorOptions = {}
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, defaultErrorMessage, options);
    return null;
  }
}
