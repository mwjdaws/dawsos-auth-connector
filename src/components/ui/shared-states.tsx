
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading data..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export interface ErrorStateProps {
  error: Error;
  title?: string;
  retry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title = "An error occurred",
  retry
}) => {
  // If retry is not provided, make it a no-op function to avoid undefined errors
  const safeRetry = retry || (() => {});
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{error.message || "Something went wrong. Please try again."}</p>
        {retry && (
          <Button
            variant="outline"
            size="sm"
            onClick={safeRetry}
            className="mt-2"
          >
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export interface EmptyStateProps {
  message?: string;
  action?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No data available",
  action,
  actionLabel = "Refresh"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <p className="text-muted-foreground">{message}</p>
      {action && (
        <Button variant="outline" size="sm" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
