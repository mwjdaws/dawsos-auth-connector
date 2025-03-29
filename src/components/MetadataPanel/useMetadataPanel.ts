
import { useState, useEffect, useTransition, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isValidContentId } from "@/utils/content-validation";

interface Tag {
  id: string;
  name: string;
  content_id: string;
}

export const useMetadataPanel = (
  contentId: string, 
  onMetadataChange?: () => void,
  isCollapsible = false,
  initialCollapsed = false
) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [newTag, setNewTag] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const { user } = useAuth();
  const isMounted = useRef(true);
  
  // State for source metadata
  const [externalSourceUrl, setExternalSourceUrl] = useState<string | null>(null);
  const [needsExternalReview, setNeedsExternalReview] = useState<boolean>(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const fetchMetadata = async () => {
    // Validate content ID before fetching metadata
    if (!isValidContentId(contentId)) {
      console.log("Invalid contentId for fetching metadata:", contentId);
      setIsLoading(false);
      setError("Invalid content ID");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching tags for contentId:", contentId);
      
      const { data: tagData, error: tagError } = await supabase
        .from("tags")
        .select("*")
        .eq("content_id", contentId);
      
      if (tagError) {
        throw tagError;
      }
      
      // Fetch source metadata
      const { data: sourceData, error: sourceError } = await supabase
        .from("knowledge_sources")
        .select("external_source_url, needs_external_review, external_source_checked_at")
        .eq("id", contentId)
        .single();
      
      if (sourceError && sourceError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - not an error for us
        throw sourceError;
      }
      
      console.log("Tags fetched:", tagData);
      console.log("Source metadata fetched:", sourceData);
      
      if (isMounted.current) {
        startTransition(() => {
          setTags(tagData || []);
          
          if (sourceData) {
            setExternalSourceUrl(sourceData.external_source_url);
            setNeedsExternalReview(sourceData.needs_external_review || false);
            setLastCheckedAt(sourceData.external_source_checked_at);
          }
        });
      }
      
      if (onMetadataChange) {
        onMetadataChange();
      }
    } catch (err: any) {
      console.error("Error fetching metadata:", err);
      if (isMounted.current) {
        setError(err.message || "Failed to fetch metadata");
        toast({
          title: "Error",
          description: "Failed to load metadata",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Fetch metadata when contentId changes
  useEffect(() => {
    console.log("MetadataPanel: contentId changed to", contentId);
    fetchMetadata();
    
    return () => {
      isMounted.current = false;
    };
  }, [contentId]);

  const handleRefresh = () => {
    fetchMetadata();
  };
  
  const handleAddTag = async () => {
    if (!newTag.trim() || !user) {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add tags",
          variant: "destructive",
        });
      }
      return;
    }

    // Validate contentId before adding tag
    if (!isValidContentId(contentId)) {
      toast({
        title: "Invalid Content",
        description: "Cannot add tags to temporary or invalid content",
        variant: "destructive",
      });
      return;
    }

    try {
      const newTagData = {
        name: newTag.trim(),
        content_id: contentId
      };
      
      console.log("Adding tag:", newTagData);
      
      const { data, error } = await supabase
        .from("tags")
        .insert(newTagData)
        .select();
      
      if (error) throw error;
      
      setTags(prev => [...prev, data![0]]);
      setNewTag("");
      
      toast({
        title: "Success",
        description: "Tag added successfully",
      });
      
      console.log("Tag added successfully:", data![0]);
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
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete tags",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Deleting tag with ID:", tagId);
      
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);
      
      if (error) throw error;
      
      setTags(tags.filter(tag => tag.id !== tagId));
      
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
      
      console.log("Tag deleted successfully");
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete tag",
        variant: "destructive",
      });
    }
  };

  return {
    tags,
    isLoading,
    error,
    isPending,
    newTag,
    setNewTag,
    user,
    externalSourceUrl,
    needsExternalReview,
    lastCheckedAt,
    isCollapsed,
    setIsCollapsed,
    handleRefresh,
    handleAddTag,
    handleDeleteTag
  };
};
