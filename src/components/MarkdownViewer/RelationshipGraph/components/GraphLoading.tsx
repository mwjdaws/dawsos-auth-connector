
import React from 'react';
import { Loader2 } from 'lucide-react';

export function GraphLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading relationship graph...</p>
    </div>
  );
}
