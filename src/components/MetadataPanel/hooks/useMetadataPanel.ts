
import { useAuth } from "@/hooks/useAuth";
import { useTagOperations } from "./useTagOperations";
import { useSourceMetadata } from "./useSourceMetadata";
import { usePanelState } from "./usePanelState";

export const useMetadataPanel = (
  contentId: string, 
  onMetadataChange?: () => void,
  isCollapsible = false,
  initialCollapsed = false
) => {
  // Use the panel state hook
  const panelState = usePanelState({ 
    contentId, 
    onMetadataChange, 
    isCollapsible, 
    initialCollapsed 
  });
  
  const { user } = useAuth();
  
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
    if (!panelState.validateContentId()) {
      return;
    }
    
    panelState.startLoading();
    
    try {
      // Fetch tags
      const tagData = await tagOperations.fetchTags();
      
      // Fetch source metadata
      const sourceData = await sourceMetadata.fetchSourceMetadata();
      
      if (panelState.isMounted.current) {
        panelState.startTransition(() => {
          // Update tags state
          tagOperations.setTags(tagData);
          
          // Update source metadata state
          if (sourceData) {
            sourceMetadata.updateSourceMetadataState(sourceData);
          }
        });
      }
      
      panelState.finishLoading(true);
    } catch (err: any) {
      console.error("Error fetching metadata:", err);
      panelState.finishLoading(false, err.message || "Failed to fetch metadata");
    }
  };

  // Fetch metadata when contentId changes
  useEffect(() => {
    console.log("MetadataPanel: contentId changed to", contentId);
    fetchMetadata();
  }, [contentId]);

  const handleRefresh = () => {
    fetchMetadata();
  };

  return {
    tags: tagOperations.tags,
    isLoading: panelState.isLoading,
    error: panelState.error,
    isPending: panelState.isPending,
    newTag: tagOperations.newTag,
    setNewTag: tagOperations.setNewTag,
    user,
    externalSourceUrl: sourceMetadata.externalSourceUrl,
    needsExternalReview: sourceMetadata.needsExternalReview,
    lastCheckedAt: sourceMetadata.lastCheckedAt,
    isCollapsed: panelState.isCollapsed,
    setIsCollapsed: panelState.setIsCollapsed,
    handleRefresh,
    handleAddTag: tagOperations.handleAddTag,
    handleDeleteTag: tagOperations.handleDeleteTag
  };
};

// Export types
export type { Tag } from "./useTagOperations";

// Add missing import
import { useEffect } from "react";
