
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { handleError, ErrorLevel, ErrorSource } from '@/utils/errors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary
 * 
 * A React class component that catches JavaScript errors anywhere in its child
 * component tree, logs those errors, and displays a fallback UI instead of the
 * component tree that crashed.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<ErrorMessage />}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  /**
   * Static method called during the "render" phase when an error is thrown
   * Updates component state so the next render will show the fallback UI
   * 
   * @param error - The error that was thrown
   * @returns Updated state object
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called after an error has been thrown by a descendant component
   * Used for side effects like logging the error
   * 
   * @param error - The error that was thrown
   * @param errorInfo - Component stack trace information
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the application's error handling system
    handleError(error, {
      message: "An unexpected error occurred",
      context: { componentStack: errorInfo.componentStack },
      level: ErrorLevel.Error,
      source: ErrorSource.Component
    });
  }

  /**
   * Renders either the children or the fallback UI based on whether an error occurred
   * 
   * @returns ReactNode - Either the children or fallback UI
   */
  public render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="p-4 rounded-md bg-destructive/10">
          <h2 className="text-lg font-semibold text-destructive mb-2">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {error?.message || "An unknown error occurred"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
