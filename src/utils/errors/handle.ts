
/**
 * Re-export the handleError function from the JSX implementation
 * This file is maintained for backward compatibility and to avoid
 * breaking existing imports throughout the codebase.
 */
export { handleError } from './handle';

// We need to provide a direct implementation that doesn't depend on JSX
// since this is a .ts file
export function handleError(
  error: unknown,
  userMessage?: string,
  options?: any
): any {
  // Just re-export the function from handle.js to avoid circular dependency
  const { handleError: actualHandler } = require('./handle');
  return actualHandler(error, userMessage, options);
}
