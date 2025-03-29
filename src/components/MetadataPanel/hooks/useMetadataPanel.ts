
import { useState, useEffect, useTransition, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isValidContentId } from "@/utils/content-validation";
import { useTagOperations, Tag } from "./useTagOperations";
import { useSourceMetadata } from "./useSourceMetadata";

export const useMetadataPanel = (
  contentId: string, 
  onMetadataChange?: () => void,
  isCollapsible = false,
  initialCollapsed = false
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const { user } = useAuth();
  const isMounted = useRef(true);
  
  // Use the tag operations hook
  const tagOperations = useTagOperations({ 
    contentId, 
    user, 
    onMetadataChange 
  });
  
  // Use the source metadata hook
  const sourceMetadata = useSourceMetadata({ contentId });

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
      // Fetch tags
      const tagData = await tagOperations.fetchTags();
      
      // Fetch source metadata
      const sourceData = await sourceMetadata.fetchSourceMetadata();
      
      if (isMounted.current) {
        startTransition(() => {
          // Update tags state
          tagOperations.setTags(tagData);
          
          // Update source metadata state
          if (sourceData) {
            sourceMetadata.updateSourceMetadataState(sourceData);
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

  return {
    tags: tagOperations.tags,
    isLoading,
    error,
    isPending,
    newTag: tagOperations.newTag,
    setNewTag: tagOperations.setNewTag,
    user,
    externalSourceUrl: sourceMetadata.externalSourceUrl,
    needsExternalReview: sourceMetadata.needsExternalReview,
    lastCheckedAt: sourceMetadata.lastCheckedAt,
    isCollapsed,
    setIsCollapsed,
    handleRefresh,
    handleAddTag: tagOperations.handleAddTag,
    handleDeleteTag: tagOperations.handleDeleteTag
  };
};

// Export types
export type { Tag } from "./useTagOperations";
