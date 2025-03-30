
/**
 * Status state components for loading, error, and empty states
 * These components provide standardized UI for common states
 * with compatibility across different component props
 */
import React from 'react';
import { Loader2, AlertCircle, FileQuestion } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertDescription, AlertTitle } from './alert';

/**
 * Loading state component
 */
export interface LoadingStateProps {
  text?: string;
  variant?: string;
}

export function LoadingState({ text = 'Loading...', variant }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

/**
 * Error state component
 */
export interface ErrorStateProps {
  error: Error | string;
  title?: string;
  retry: () => void;
}

export function ErrorState({ 
  error, 
  title = 'An error occurred', 
  retry 
}: ErrorStateProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{errorMessage}</p>
        {retry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={retry}
            className="mt-2"
          >
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Empty state component
 */
export interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: () => void;
  actionLabel?: string;
}

export function EmptyState({ 
  title = 'No items found', 
  message = 'There are no items to display.',
  action,
  actionLabel = 'Refresh'
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {action && (
        <Button onClick={action} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
