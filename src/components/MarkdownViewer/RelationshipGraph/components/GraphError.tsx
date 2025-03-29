
/**
 * GraphError Component
 * 
 * Displays an error message when there's a problem fetching or processing
 * the graph data. Provides a retry button to attempt fetching the data again.
 */
import React from 'react';
import { Button } from '@/components/ui/button';

interface GraphErrorProps {
  error: string;         // Error message to display
  onRetry: () => void;   // Function to call when retry button is clicked
}

export function GraphError({ error, onRetry }: GraphErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
        <p>{error}</p>
      </div>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  );
}
