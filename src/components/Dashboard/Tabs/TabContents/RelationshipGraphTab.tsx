
import React, { useState, Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RelationshipGraphPanel } from "@/components/MarkdownViewer/RelationshipGraph";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useOntologyTerms } from "@/hooks/markdown-editor/useOntologyTerms";
import { useSourceLinks } from "@/hooks/markdown-editor/useNoteLinks";
import { useKnowledgeSourceQuery } from "@/hooks/useKnowledgeSourceQuery";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ensureString } from "@/utils/compatibility";

interface RelationshipGraphTabProps {
  contentId: string;
}

export function RelationshipGraphTab({ contentId }: RelationshipGraphTabProps) {
  const [hasAttemptedRetry, setHasAttemptedRetry] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { sourceTerms, isLoading: isLoadingTerms } = useOntologyTerms(contentId);
  const { outboundLinks, inboundLinks, isLoading: isLoadingLinks, error: linksError } = useSourceLinks(contentId);
  const { data: sourceInfo } = useKnowledgeSourceQuery(contentId);
  
  useEffect(() => {
    if (linksError) {
      setError(linksError instanceof Error ? linksError : new Error('Failed to load graph data'));
      
      toast({
        title: "Error loading graph data",
        description: "There was a problem loading relationship data",
        variant: "destructive",
      });
    }
  }, [linksError]);

  const handleRefresh = () => {
    setError(null);
    setHasAttemptedRetry(true);
  };

  const isLoading = isLoadingTerms || isLoadingLinks;
  const hasConnections = sourceTerms.length > 0 || outboundLinks.length > 0 || inboundLinks.length > 0;

  // Helper function to safely get title from knowledge_sources
  const getTargetTitle = (link: any) => {
    if (link.target_title) {
      return link.target_title;
    }
    
    if (link.knowledge_sources && typeof link.knowledge_sources === 'object') {
      return link.knowledge_sources.title || 'Unknown';
    }
    
    return 'Unknown';
  };
  
  const getSourceTitle = (link: any) => {
    if (link.source_title) {
      return link.source_title;
    }
    
    if (link.knowledge_sources && typeof link.knowledge_sources === 'object') {
      return link.knowledge_sources.title || 'Unknown';
    }
    
    return 'Unknown';
  };

  // Prepare graph data
  const graphData = {
    nodes: [
      {
        id: contentId,
        name: sourceInfo?.title || 'Current Source',
        title: sourceInfo?.title || 'Current Source',
        color: '#0ea5e9',
        type: 'source'
      },
      // Add nodes from source terms
      ...sourceTerms.map(term => ({
        id: term.id,
        name: term.term,
        title: term.term,
        color: '#4f46e5',
        type: 'term'
      })),
      // Add nodes from links
      ...outboundLinks.map(link => ({
        id: link.target_id,
        name: getTargetTitle(link),
        title: getTargetTitle(link),
        color: '#16a34a',
        type: 'outbound'
      })),
      ...inboundLinks.map(link => ({
        id: link.source_id,
        name: getSourceTitle(link),
        title: getSourceTitle(link),
        color: '#ea580c',
        type: 'inbound'
      }))
    ],
    links: [
      // Add links for terms
      ...sourceTerms.map(term => ({
        source: contentId,
        target: term.id,
        type: 'term'
      })),
      // Add outbound links
      ...outboundLinks.map(link => ({
        source: contentId,
        target: link.target_id,
        type: ensureString(link.link_type)
      })),
      // Add inbound links
      ...inboundLinks.map(link => ({
        source: link.source_id,
        target: contentId,
        type: ensureString(link.link_type)
      }))
    ]
  };

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
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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
        
        {error ? (
          <Card className="min-h-[400px] flex items-center justify-center">
            <div className="text-center p-6">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">Error Loading Graph</h3>
              <p className="text-muted-foreground mb-4">
                {error.message || "Failed to load the knowledge graph"}
              </p>
              <Button onClick={handleRefresh}>Try Again</Button>
            </div>
          </Card>
        ) : (
          <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
            <div className="min-h-[400px] border rounded-lg bg-card overflow-hidden">
              <RelationshipGraphPanel 
                contentId={contentId} 
                graphData={graphData}
                hasAttemptedRetry={hasAttemptedRetry}
              />
            </div>
          </Suspense>
        )}
        
        {!isLoading && !hasConnections && !error && (
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
