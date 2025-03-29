
/**
 * RelationshipGraphTab Component
 * 
 * A container component that renders the RelationshipGraphPanel within the
 * dashboard tabs interface. It passes the content ID to the graph panel to
 * potentially use as a starting node.
 */
import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { RelationshipGraphPanel } from '@/components/MarkdownViewer/RelationshipGraph';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useKnowledgeSourcesQuery } from '@/hooks/markdown-editor/useKnowledgeSources';

interface RelationshipGraphTabProps {
  contentId?: string;  // ID of the current content, used as starting node in the graph
}

export function RelationshipGraphTab({ contentId }: RelationshipGraphTabProps) {
  const [isPending, startTransition] = useTransition();
  const [key, setKey] = useState(Date.now()); // Used to force component remount
  const [hasAttemptedRetry, setHasAttemptedRetry] = useState(false);
  const { data: knowledgeSources, isLoading: isLoadingSources } = useKnowledgeSourcesQuery();
  
  // Check if we have a valid contentId or should auto-select one
  const [emptyId, setEmptyId] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(contentId);
  
  // Check if we have a valid contentId or should auto-select one from available sources
  useEffect(() => {
    startTransition(() => {
      // First priority: use the contentId passed as prop if it's valid
      if (contentId && !contentId.startsWith('temp-')) {
        setSelectedId(contentId);
        setEmptyId(false);
        return;
      }
      
      // Second priority: if we have knowledge sources, use the first one
      if (knowledgeSources && knowledgeSources.length > 0) {
        console.log("Auto-selecting first knowledge source:", knowledgeSources[0].id);
        setSelectedId(knowledgeSources[0].id);
        setEmptyId(false);
        return;
      }
      
      // If we have no contentId and no knowledge sources, show empty state
      setEmptyId(true);
    });
  }, [contentId, knowledgeSources, startTransition]);
  
  // Reset retry state when selectedId changes
  useEffect(() => {
    startTransition(() => {
      setHasAttemptedRetry(false);
    });
  }, [selectedId, startTransition]);
  
  // Force refresh of the graph
  const handleRefresh = useCallback(() => {
    startTransition(() => {
      setKey(Date.now());
      setHasAttemptedRetry(true);
    });
    
    toast({
      title: "Refreshing Graph",
      description: "The knowledge graph is being refreshed...",
    });
  }, [startTransition]);
  
  // Show loading state while fetching knowledge sources or during transitions
  if (isLoadingSources || isPending) {
    return (
      <div className="bg-card border rounded-lg shadow-sm p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground">Loading knowledge sources...</p>
      </div>
    );
  }
  
  // If we have no valid ID and no knowledge sources, show empty state
  if (emptyId) {
    return (
      <div className="bg-card border rounded-lg shadow-sm p-6 flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
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
    <div className="bg-card border rounded-lg shadow-sm relative min-h-[500px]">
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
      <RelationshipGraphPanel 
        key={key} 
        sourceId={selectedId} 
        hasAttemptedRetry={hasAttemptedRetry}
      />
    </div>
  );
}
