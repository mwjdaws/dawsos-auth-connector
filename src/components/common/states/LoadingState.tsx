
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

export interface LoadingStateProps {
  text?: string;
}

export function LoadingState({ text = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-background/50">
      <Spinner className="h-8 w-8 text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
