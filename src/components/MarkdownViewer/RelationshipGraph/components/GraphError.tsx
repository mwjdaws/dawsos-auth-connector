
import React from 'react';
import { Button } from '@/components/ui/button';

interface GraphErrorProps {
  error: string;
  onRetry: () => void;
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
