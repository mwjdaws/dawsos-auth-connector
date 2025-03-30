
/**
 * Re-export the handleError function from the JSX implementation
 * This file is maintained for backward compatibility and to avoid
 * breaking existing imports throughout the codebase.
 */
import { handleError as handleErrorJSX, handleErrorSafe } from './handle.tsx';

// Make sure we're exporting the JSX version
export { handleErrorJSX as handleError, handleErrorSafe };

/**
 * Safe handler implementation that doesn't require JSX
 * Legacy export for compatibility
 */
export default handleErrorJSX;
