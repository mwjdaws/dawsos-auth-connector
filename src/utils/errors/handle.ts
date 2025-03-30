
/**
 * Re-export the handleError function from the JSX implementation
 * This file is maintained for backward compatibility and to avoid
 * breaking existing imports throughout the codebase.
 */
import { handleError as handleErrorJSX } from './handle.jsx';

export { handleErrorJSX as handleError };

/**
 * Safe handler implementation that doesn't require JSX
 */
export function handleErrorSafe(
  error: unknown,
  userMessage?: string,
  options?: any
): any {
  try {
    // Use the imported JSX version if available
    return handleErrorJSX(error, userMessage, options);
  } catch (e) {
    // Fallback implementation for non-JSX environments
    console.error('Error handling error:', error);
    console.error('User message:', userMessage);
    console.error('Options:', options);
    return {
      error,
      message: userMessage || 'An error occurred',
      handled: true
    };
  }
}
