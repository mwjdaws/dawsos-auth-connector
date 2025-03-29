
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
  loadingTime?: number; // Allow external control of loading time
}

export function GraphLoading({ onManualRetry, loadingTime: externalLoadingTime }: GraphLoadingProps) {
  const [internalLoadingTime, setInternalLoadingTime] = useState(0);
  
  // Use externally provided loading time if available, otherwise use internal state
  const loadingTime = typeof externalLoadingTime === 'number' ? externalLoadingTime : internalLoadingTime;
  
  useEffect(() => {
    // Only increment internal timer if we're not using an external one
    if (typeof externalLoadingTime === 'number') return;
    
    const interval = setInterval(() => {
      setInternalLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [externalLoadingTime]);
  
  // Show retry option if loading takes more than 8 seconds
  const showRetryOption = loadingTime > 8 && onManualRetry;
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground mb-2">Loading relationship graph...</p>
      
      {loadingTime > 3 && (
        <p className="text-sm text-muted-foreground mb-4">
          This may take a moment as we build the knowledge graph.
        </p>
      )}
      
      {loadingTime > 5 && (
        <p className="text-sm text-muted-foreground mb-4">
          Establishing connections between knowledge sources...
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
            className="flex items-center gap-1"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            Retry Loading
          </Button>
        </div>
      )}
    </div>
  );
}
