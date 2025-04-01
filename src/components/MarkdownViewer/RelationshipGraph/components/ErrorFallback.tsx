
import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ErrorFallback() {
  return (
    <div className="p-4 flex flex-col items-center justify-center h-full">
      <AlertCircle className="h-8 w-8 text-destructive mb-2" />
      <h3 className="font-medium">Graph Visualization Error</h3>
      <p className="text-muted-foreground text-sm text-center mt-1">
        An error occurred while rendering the knowledge graph.
        <br />
        Please try refreshing the page.
      </p>
    </div>
  );
}
