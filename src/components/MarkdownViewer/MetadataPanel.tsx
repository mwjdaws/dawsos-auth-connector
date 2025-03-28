
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ChevronRight, ChevronDown, ExternalLink } from "lucide-react";
import { TagInput } from "./TagInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Tag {
  id: string;
  name: string;
  content_id: string;
}

interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
}

interface MetadataPanelProps {
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  domain: string | null;
  externalSourceUrl: string | null;
  isLoading: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  editable: boolean;
  onAddTag: () => void;
  onDeleteTag: (tagId: string) => void;
  isPending: boolean;
}

export function MetadataPanel({
  tags,
  ontologyTerms,
  domain,
  externalSourceUrl,
  isLoading,
  newTag,
  setNewTag,
  editable,
  onAddTag,
  onDeleteTag,
  isPending
}: MetadataPanelProps) {
  const [isMetadataCollapsed, setIsMetadataCollapsed] = useState(false);

  const handleDeleteTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);

      if (error) throw error;

      onDeleteTag(tagId);
      
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      toast({
        title: "Error",
        description: "Failed to delete tag. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <button
          className="flex w-full items-center justify-between"
          onClick={() => setIsMetadataCollapsed(!isMetadataCollapsed)}
        >
          <h2 className="text-xl font-semibold">Metadata</h2>
          {isMetadataCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      {!isMetadataCollapsed && (
        <div className="p-4 space-y-4">
          {isLoading ? (
            <>
              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <Skeleton className="h-8 w-full" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
                <Skeleton className="h-8 w-full" />
              </div>
            </>
          ) : (
            <>
              {externalSourceUrl && (
                <div>
                  <h3 className="text-sm font-medium mb-2">External Source</h3>
                  <a
                    href={externalSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> View Source
                  </a>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge 
                        key={tag.id} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag.name}
                        {editable && (
                          <button 
                            onClick={() => handleDeleteTag(tag.id)}
                            className="text-muted-foreground hover:text-foreground ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tags available</p>
                )}
                
                {editable && (
                  <div className="mt-2">
                    <TagInput 
                      onAddTag={onAddTag} 
                      newTag={newTag} 
                      setNewTag={setNewTag} 
                    />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
                {ontologyTerms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {ontologyTerms.map((term) => (
                      <Badge 
                        key={term.id} 
                        variant="outline"
                        className="bg-green-50"
                      >
                        {term.term}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No ontology terms available</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Domain</h3>
                {domain ? (
                  <Badge className="bg-blue-50 text-blue-800 border-blue-200">
                    {domain}
                  </Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">No domain specified</p>
                )}
              </div>
            </>
          )}
          {isPending && <div className="text-sm text-muted-foreground">Updating metadata...</div>}
        </div>
      )}
    </Card>
  );
}

export default MetadataPanel;
