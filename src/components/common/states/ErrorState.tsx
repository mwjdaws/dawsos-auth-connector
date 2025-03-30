
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface ErrorStateProps {
  error: Error;
  title: string;
  retry?: (() => void) | undefined;
}

export function ErrorState({ error, title, retry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center border rounded-md bg-destructive/10">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{error.message}</p>
      
      {retry && (
        <Button 
          variant="outline" 
          className="mt-2 gap-1" 
          onClick={retry}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Try Again
        </Button>
      )}
    </div>
  );
}
