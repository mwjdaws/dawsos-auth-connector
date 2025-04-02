
/**
 * This file was incorrectly named .jsx but now renamed to .tsx
 * We're now using this file to simply re-export the correct
 * implementations from handle.ts to maintain backward compatibility.
 */
export { 
  handleError, 
  handleErrorSafe, 
  createComponentErrorHandler,
  createHookErrorHandler,
  createServiceErrorHandler,
  createErrorHandler,
  default
} from './handle';
