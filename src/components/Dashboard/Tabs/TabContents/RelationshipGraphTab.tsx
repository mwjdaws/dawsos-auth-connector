
/**
 * RelationshipGraphTab Component
 * 
 * A container component that renders the RelationshipGraphPanel within the
 * dashboard tabs interface. It passes the content ID to the graph panel to
 * potentially use as a starting node.
 */
import React, { useState, useEffect } from 'react';
import { RelationshipGraphPanel } from '@/components/MarkdownViewer/RelationshipGraph';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RelationshipGraphTabProps {
  contentId?: string;  // ID of the current content, used as starting node in the graph
}

export function RelationshipGraphTab({ contentId }: RelationshipGraphTabProps) {
  const [key, setKey] = useState(Date.now()); // Used to force component remount
  const [emptyId, setEmptyId] = useState(false);
  
  // Check if we have a valid contentId
  useEffect(() => {
    setEmptyId(!contentId || contentId.startsWith('temp-'));
  }, [contentId]);
  
  // Force refresh of the graph
  const handleRefresh = () => {
    setKey(Date.now());
  };
  
  if (emptyId) {
    return (
      <div className="bg-card border rounded-lg shadow-sm p-6 flex flex-col items-center justify-center min-h-[400px]">
        <h3 className="text-xl font-medium mb-4">No Knowledge Source Selected</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Please select or create a knowledge source first to view its relationships in the graph.
        </p>
        <Button 
          variant="outline"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-card border rounded-lg shadow-sm relative">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          title="Refresh graph"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
      <RelationshipGraphPanel key={key} sourceId={contentId} />
    </div>
  );
}
