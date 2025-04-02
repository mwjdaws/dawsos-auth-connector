
/**
 * Error handler wrappers
 * 
 * These utilities provide convenient ways to wrap functions with error handling.
 */
import { handleError } from './handle';
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './types';

/**
 * Wrap a function with error handling
 * 
 * @param fn The function to wrap
 * @param options Error handling options
 * @returns A wrapped function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  options: Partial<ErrorHandlingOptions> | string
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  // Convert string options to object
  const errorOptions = typeof options === 'string' 
    ? { message: options } 
    : options;
  
  // Return wrapped function
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    try {
      return fn(...args);
    } catch (error) {
      handleError(error, {
        ...errorOptions,
        context: {
          ...(errorOptions.context || {}),
          functionName: fn.name,
          arguments: args
        }
      });
      return undefined;
    }
  };
}

/**
 * Wrap an async function with error handling
 * 
 * @param fn The async function to wrap
 * @param options Error handling options
 * @returns A wrapped async function with error handling
 */
export function withAsyncErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: Partial<ErrorHandlingOptions> | string
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | undefined> {
  // Convert string options to object
  const errorOptions = typeof options === 'string' 
    ? { message: options } 
    : options;
  
  // Return wrapped async function
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, {
        ...errorOptions,
        context: {
          ...(errorOptions.context || {}),
          functionName: fn.name,
          arguments: args
        }
      });
      return undefined;
    }
  };
}

/**
 * Wrap a component with error handling
 */
export function withComponentErrorHandling<T extends React.ComponentType<any>>(
  Component: T,
  options: Partial<ErrorHandlingOptions> | string
): T {
  // Convert string options to object
  const errorOptions = typeof options === 'string' 
    ? { message: options } 
    : options;
  
  const displayName = Component.displayName || Component.name || 'Component';
  
  // Apply context/source defaults if not provided
  const fullOptions = {
    source: ErrorSource.Component,
    ...errorOptions,
    context: {
      componentName: displayName,
      ...(errorOptions.context || {})
    }
  };
  
  // Create wrapped component with same type as original
  const WrappedComponent = (props: any) => {
    try {
      return <Component {...props} />;
    } catch (error) {
      handleError(error, fullOptions);
      return null;
    }
  };
  
  // Preserve display name for DevTools
  WrappedComponent.displayName = `withErrorHandling(${displayName})`;
  
  return WrappedComponent as T;
}
