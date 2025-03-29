
/**
 * GraphLoading Component
 * 
 * Displays a loading indicator when the graph data is being fetched.
 * This provides visual feedback to users during data loading.
 */
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GraphLoadingProps {
  onManualRetry?: () => void;
}

export function GraphLoading({ onManualRetry }: GraphLoadingProps) {
  const [loadingTime, setLoadingTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Show retry option if loading takes more than 10 seconds
  const showRetryOption = loadingTime > 10 && onManualRetry;
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground mb-2">Loading relationship graph...</p>
      
      {loadingTime > 5 && (
        <p className="text-sm text-muted-foreground mb-4">
          This may take a moment as we build the knowledge graph.
        </p>
      )}
      
      {showRetryOption && (
        <div className="mt-4">
          <p className="text-sm text-amber-600 mb-2">
            Loading is taking longer than expected.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onManualRetry}
          >
            Retry Loading
          </Button>
        </div>
      )}
    </div>
  );
}
