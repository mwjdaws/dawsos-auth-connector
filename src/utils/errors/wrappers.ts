
/**
 * Error handling wrappers and decorators
 */
import { handleError } from './handle';
import { ErrorOptions } from './types';

/**
 * Wrap a function with error handling
 * 
 * @param fn The function to wrap
 * @param options Error handling options
 * @returns A function that handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  options?: ErrorOptions & { errorMessage?: string }
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      const result = fn(...args);
      
      // Handle promise results
      if (result instanceof Promise) {
        return result.catch(error => {
          handleError(
            error, 
            options?.errorMessage, 
            options
          );
          throw error; // Re-throw to allow further handling
        }) as ReturnType<T>;
      }
      
      return result;
    } catch (error) {
      handleError(
        error, 
        options?.errorMessage, 
        options
      );
      throw error; // Re-throw to allow further handling
    }
  };
}
