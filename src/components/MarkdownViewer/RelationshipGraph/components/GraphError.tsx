
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GraphErrorProps {
  error: string;
  onRetry: () => void;
}

export function GraphError({ error, onRetry }: GraphErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Alert variant="destructive" className="mb-4 max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading graph</AlertTitle>
        <AlertDescription className="mt-2">
          {error}
        </AlertDescription>
      </Alert>
      
      <Button onClick={onRetry} className="mt-4">
        Try Again
      </Button>
    </div>
  );
}
