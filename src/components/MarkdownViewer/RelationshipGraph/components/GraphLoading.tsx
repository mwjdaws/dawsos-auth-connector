
import React from 'react';
import { Loader2 } from 'lucide-react';

interface GraphLoadingProps {
  loadingTime: number;
}

export function GraphLoading({ loadingTime }: GraphLoadingProps) {
  // Show different messages based on loading time
  const getMessage = () => {
    if (loadingTime < 2) {
      return "Loading graph data...";
    } else if (loadingTime < 5) {
      return "Retrieving knowledge connections...";
    } else if (loadingTime < 10) {
      return "This is taking longer than expected...";
    } else {
      return "Still working... complex graphs may take time to load";
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-center text-muted-foreground">{getMessage()}</p>
      {loadingTime > 5 && (
        <p className="text-xs text-muted-foreground mt-2">
          ({loadingTime}s)
        </p>
      )}
    </div>
  );
}
