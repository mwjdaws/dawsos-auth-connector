
import { handleError } from './handle';
import { ErrorHandlingOptions, ErrorLevel } from './types';
import { compatibleErrorOptions } from '../compatibility';

/**
 * Creates an error handler specifically for component usage
 * 
 * @param componentName The name of the component for context
 * @returns A function to handle errors in that component
 */
export function createComponentErrorHandler(componentName: string) {
  return (error: unknown, message = 'Error in component', options?: Partial<ErrorHandlingOptions>) => {
    // Apply compatibility fixes to options
    const compatOptions = compatibleErrorOptions(options);
    
    handleError(error, message, {
      context: { 
        component: componentName,
        ...compatOptions?.context
      },
      level: compatOptions?.level || ErrorLevel.ERROR,
      ...compatOptions
    });
  };
}

/**
 * Creates an error handler specifically for hook usage
 * 
 * @param hookName The name of the hook for context
 * @returns A function to handle errors in that hook
 */
export function createHookErrorHandler(hookName: string) {
  return (error: unknown, message = 'Error in hook', options?: Partial<ErrorHandlingOptions>) => {
    // Apply compatibility fixes to options
    const compatOptions = compatibleErrorOptions(options);
    
    handleError(error, message, {
      context: { 
        hook: hookName,
        ...compatOptions?.context
      },
      level: compatOptions?.level || ErrorLevel.ERROR,
      ...compatOptions
    });
  };
}

/**
 * Creates an error handler specifically for service usage
 * 
 * @param serviceName The name of the service for context
 * @returns A function to handle errors in that service
 */
export function createServiceErrorHandler(serviceName: string) {
  return (error: unknown, message = 'Service error', options?: Partial<ErrorHandlingOptions>) => {
    // Apply compatibility fixes to options
    const compatOptions = compatibleErrorOptions(options);
    
    handleError(error, message, {
      context: { 
        service: serviceName,
        ...compatOptions?.context
      },
      level: compatOptions?.level || ErrorLevel.ERROR,
      reportToService: true,
      ...compatOptions
    });
  };
}
