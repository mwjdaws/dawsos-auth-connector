
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Props for the ErrorFallback component
 */
export interface ErrorFallbackProps {
  error: string | Error;
  onRetry?: () => void;
}

/**
 * ErrorFallback Component
 * 
 * Displays an error message when the graph fails to load.
 */
export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';

  return (
    <Card className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="font-medium text-lg mb-2">Error Loading Graph</h3>
        <p className="text-muted-foreground mb-4">
          {errorMessage}
        </p>
        {onRetry && (
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
}
