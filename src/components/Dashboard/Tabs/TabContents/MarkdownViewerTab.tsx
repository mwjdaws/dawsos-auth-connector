import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import MetadataPanel from "@/components/MetadataPanel";

interface KnowledgeSource {
  id: string;
  title: string;
  content: string;
  external_source_url: string | null;
  created_at: string;
}

export function MarkdownViewerTab() {
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  // Fetch knowledge sources for dropdown
  const { data: knowledgeSources, isLoading: isLoadingSources, error: sourcesError } = useQuery({
    queryKey: ['knowledgeSources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('id, title, created_at')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as KnowledgeSource[];
    }
  });

  // Fetch selected knowledge source content
  const { data: sourceContent, isLoading: isLoadingContent, error: contentError } = useQuery({
    queryKey: ['knowledgeSource', selectedSourceId],
    queryFn: async () => {
      if (!selectedSourceId) return null;
      
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('id, title, content, external_source_url, created_at')
        .eq('id', selectedSourceId)
        .maybeSingle();
        
      if (error) throw error;
      return data as KnowledgeSource | null;
    },
    enabled: !!selectedSourceId
  });

  // Set first source as default when data loads
  useEffect(() => {
    if (knowledgeSources && knowledgeSources.length > 0 && !selectedSourceId) {
      setSelectedSourceId(knowledgeSources[0].id);
    }
  }, [knowledgeSources, selectedSourceId]);

  // Handle metadata changes
  const handleMetadataChange = () => {
    console.log("Metadata updated for source:", selectedSourceId);
  };

  // Handle errors
  if (sourcesError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-red-500" /> 
          Error Loading Sources
        </h2>
        <p className="text-red-700">
          {sourcesError instanceof Error ? sourcesError.message : "Failed to load knowledge sources"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Markdown Viewer</h2>
      
      <div className="mb-6">
        {isLoadingSources ? (
          <Skeleton className="h-10 w-full" />
        ) : knowledgeSources && knowledgeSources.length > 0 ? (
          <Select 
            value={selectedSourceId || ''} 
            onValueChange={(value) => setSelectedSourceId(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a knowledge source" />
            </SelectTrigger>
            <SelectContent>
              {knowledgeSources.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Card className="p-4 text-center bg-muted/20">
            <p>No knowledge sources available.</p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
          {contentError ? (
            <div className="p-4 border border-red-300 bg-red-50 rounded-md">
              <h2 className="text-lg font-medium mb-2 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-500" /> 
                Error Loading Content
              </h2>
              <p className="text-red-700">
                {contentError instanceof Error ? contentError.message : "Failed to load source content"}
              </p>
            </div>
          ) : isLoadingContent ? (
            <Skeleton className="h-[400px] w-full rounded-lg" />
          ) : sourceContent ? (
            <MarkdownViewer 
              content={sourceContent.content}
              contentId={sourceContent.id}
              editable={false}
            />
          ) : selectedSourceId ? (
            <div className="p-4 text-center bg-muted/10 border rounded-lg">
              <p>The selected source could not be found.</p>
            </div>
          ) : (
            <div className="p-4 text-center bg-muted/10 border rounded-lg">
              <p>Select a knowledge source to view its content.</p>
            </div>
          )}
        </Suspense>

        {selectedSourceId && !isLoadingContent && sourceContent && (
          <div className="mt-6">
            <MetadataPanel 
              contentId={selectedSourceId}
              onMetadataChange={handleMetadataChange}
              showOntologyTerms={true}
              isCollapsible={true}
              initialCollapsed={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
