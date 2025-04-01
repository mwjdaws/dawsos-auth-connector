
/**
 * Re-export the handleError function from the JSX implementation
 * This file is maintained for backward compatibility and to avoid
 * breaking existing imports throughout the codebase.
 */
import { handleError, handleErrorSafe, createComponentErrorHandler } from './handle.tsx';

// Export both named exports and default export for flexibility
export { handleError, handleErrorSafe, createComponentErrorHandler };
export default handleError;
