
/**
 * EmptyGraphState Component
 * 
 * Displays a message when no graph data is available.
 */
import React from 'react';

interface EmptyGraphStateProps {
  onRefresh: () => void;
}

export function EmptyGraphState({ onRefresh }: EmptyGraphStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <p className="text-muted-foreground mb-4">
        No relationship data available for this knowledge source.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Try adding some ontology terms or linking to other sources.
      </p>
      <button 
        className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        onClick={onRefresh}
      >
        Refresh Graph Data
      </button>
    </div>
  );
}
