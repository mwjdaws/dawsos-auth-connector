
import React, { useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RelationshipGraphPanel } from "@/components/MarkdownViewer/RelationshipGraph";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useOntologyTerms } from "@/hooks/markdown-editor/useOntologyTerms";
import { useSourceLinks } from "@/hooks/markdown-editor/useNoteLinks";

interface RelationshipGraphTabProps {
  contentId: string;
}

export function RelationshipGraphTab({ contentId }: RelationshipGraphTabProps) {
  const [hasAttemptedRetry, setHasAttemptedRetry] = useState(false);
  const { sourceTerms, isLoading: isLoadingTerms } = useOntologyTerms(contentId);
  const { outboundLinks, inboundLinks, isLoading: isLoadingLinks } = useSourceLinks(contentId);
  
  const handleRefresh = () => {
    setHasAttemptedRetry(true);
  };

  const isLoading = isLoadingTerms || isLoadingLinks;
  const hasConnections = sourceTerms.length > 0 || outboundLinks.length > 0 || inboundLinks.length > 0;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Knowledge Graph</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Graph
        </Button>
      </div>
      
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading connections...</p>
            </div>
          </div>
        )}
        
        <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
          <div className="min-h-[400px] border rounded-lg bg-card overflow-hidden">
            <RelationshipGraphPanel 
              contentId={contentId} 
              hasAttemptedRetry={hasAttemptedRetry}
            />
          </div>
        </Suspense>
        
        {!isLoading && !hasConnections && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
              <p className="text-muted-foreground mb-2">
                No connections found for this content
              </p>
              <p className="text-xs text-muted-foreground">
                Add ontology terms or create links to see the knowledge graph
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
