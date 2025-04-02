
/**
 * Re-export the handleError function from the standard implementation
 * This file is maintained for backward compatibility.
 */
import { 
  handleError, 
  handleErrorSafe, 
  createComponentErrorHandler,
  createHookErrorHandler,
  createServiceErrorHandler
} from './handle';

// Export both named exports and default export for flexibility
export { 
  handleError, 
  handleErrorSafe, 
  createComponentErrorHandler,
  createHookErrorHandler,
  createServiceErrorHandler
};

export default handleError;
