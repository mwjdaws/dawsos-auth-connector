
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { handleError } from '@/utils/errors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * A component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the application's error handling system
    handleError(error, "An unexpected error occurred", {
      context: { componentStack: errorInfo.componentStack },
      level: 'error',
    });
  }

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
