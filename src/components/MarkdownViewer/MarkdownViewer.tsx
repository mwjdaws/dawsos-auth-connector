
import React, { useState, useEffect, useTransition } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ContentPanel } from "./ContentPanel";
import { MetadataPanel } from "./MetadataPanel";
import { processWikilinks } from "./utils/wikilinksProcessor";

interface MarkdownViewerProps {
  content: string;
  contentId: string;
  editable?: boolean;
  className?: string;
}

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

export function MarkdownViewer({ content, contentId, editable = false, className }: MarkdownViewerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  const [domain, setDomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [isPending, startTransition] = useTransition();
  const [processedContent, setProcessedContent] = useState(content);
  const { user } = useAuth();

  // Process the content for wikilinks when it changes
  useEffect(() => {
    startTransition(() => {
      setProcessedContent(processWikilinks(content));
    });
  }, [content]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchMetadata = async () => {
      if (!contentId) return;
      
      setIsLoading(true);
      try {
        // Fetch tags for the content
        const { data: tagData, error: tagError } = await supabase
          .from("tags")
          .select("*")
          .eq("content_id", contentId);
        
        if (tagError) throw tagError;
        
        if (isMounted) {
          startTransition(() => {
            setTags(tagData || []);
          });
        }

        // In the future, fetch ontology terms and domain information
        // For now, we'll use placeholder data
        if (isMounted) {
          setOntologyTerms([]);
          setDomain(null);
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
        toast({
          title: "Error",
          description: "Failed to load content metadata",
          variant: "destructive",
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (contentId) {
      fetchMetadata();
    }
    
    return () => {
      isMounted = false;
    };
  }, [contentId]);

  const handleAddTag = async () => {
    if (!newTag.trim() || !user) return;
    
    try {
      const newTagObj = {
        name: newTag.trim(),
        content_id: contentId
      };
      
      const { data, error } = await supabase
        .from("tags")
        .insert(newTagObj)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        startTransition(() => {
          setTags([...tags, data[0]]);
          setNewTag("");
        });
        
        toast({
          title: "Success",
          description: "Tag added successfully",
        });
      }
    } catch (error: any) {
      console.error("Error adding tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);
      
      if (error) throw error;
      
      startTransition(() => {
        setTags(tags.filter(tag => tag.id !== tagId));
      });
      
      toast({
        title: "Success",
        description: "Tag removed successfully",
      });
    } catch (error: any) {
      console.error("Error removing tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove tag",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("flex flex-col lg:flex-row gap-6", className)}>
      <div className="flex-1">
        <ContentPanel 
          content={content} 
          processedContent={processedContent} 
        />
      </div>

      <div className="w-full lg:w-1/3 lg:max-w-xs">
        <MetadataPanel
          tags={tags}
          ontologyTerms={ontologyTerms}
          domain={domain}
          isLoading={isLoading}
          newTag={newTag}
          setNewTag={setNewTag}
          editable={editable}
          onAddTag={handleAddTag}
          onDeleteTag={handleDeleteTag}
          isPending={isPending}
        />
      </div>
    </div>
  );
}

export default MarkdownViewer;
