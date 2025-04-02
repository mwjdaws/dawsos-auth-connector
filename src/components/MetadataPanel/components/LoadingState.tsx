
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading metadata...' }) => {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-3/4" />
      <div className="text-center text-sm text-muted-foreground mt-2">
        {message}
      </div>
    </div>
  );
};

export default LoadingState;
