
import React from 'react';
import { NetworkIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyGraphStateProps {
  startingNodeId: string;
  onRetry: () => void;
}

export function EmptyGraphState({ startingNodeId, onRetry }: EmptyGraphStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <NetworkIcon className="h-12 w-12 text-muted-foreground mb-4" />
      
      <h3 className="text-lg font-medium mb-2">No connections found</h3>
      
      {startingNodeId ? (
        <p className="text-muted-foreground mb-4 max-w-md">
          This content doesn't have any connections to other knowledge sources yet.
          Try adding some links to other content.
        </p>
      ) : (
        <p className="text-muted-foreground mb-4 max-w-md">
          No content relationships were found. Start connecting your knowledge sources
          to build a knowledge graph.
        </p>
      )}
      
      <Button onClick={onRetry} size="sm" className="mt-2">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
}
