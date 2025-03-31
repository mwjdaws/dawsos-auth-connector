
import { handleError } from './handle';

interface ErrorOptions {
  context?: Record<string, any>;
  level?: 'debug' | 'info' | 'warning' | 'error';
  silent?: boolean;
}

/**
 * Try an action and handle any errors
 * 
 * @param action The action to try
 * @param errorMessage The message to display if an error occurs
 * @param options Options for error handling
 * @returns The result of the action
 */
export async function tryAction<T>(
  action: () => Promise<T>,
  errorMessage: string,
  options?: ErrorOptions
): Promise<T> {
  try {
    return await action();
  } catch (err) {
    handleError(err, errorMessage, options);
    throw err;
  }
}

/**
 * Create an error handler for a specific component
 * 
 * @param componentName The name of the component
 * @returns An error handler function for that component
 */
export function createComponentErrorHandler(componentName: string) {
  return (error: unknown, message?: string, options?: ErrorOptions) => {
    handleError(error, message, {
      ...options,
      context: {
        ...(options?.context || {}),
        component: componentName
      }
    });
  };
}
