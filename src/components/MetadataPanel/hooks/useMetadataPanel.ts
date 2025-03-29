import { useAuth } from "@/hooks/useAuth";
import { useTagOperations } from "./useTagOperations";
import { useSourceMetadata } from "./useSourceMetadata";
import { usePanelState } from "./usePanelState";
import { useEffect } from "react";
import { handleError } from "@/utils/errors";

/**
 * useMetadataPanel Hook
 * 
 * Core hook that manages the state and operations for the MetadataPanel component.
 * Combines multiple specialized hooks for different aspects of metadata management.
 * 
 * Features:
 * - Fetches and manages tag data
 * - Handles external source metadata
 * - Manages UI state like loading, errors, and collapse/expand
 * - Provides operations for adding/removing tags
 * 
 * @example
 * ```tsx
 * const {
 *   tags,
 *   isLoading,
 *   error,
 *   newTag,
 *   setNewTag,
 *   externalSourceUrl,
 *   needsExternalReview,
 *   handleRefresh,
 *   handleAddTag,
 *   handleDeleteTag
 * } = useMetadataPanel("content-123", () => {}, true, false);
 * ```
 * 
 * @param contentId - The ID of the content to fetch metadata for
 * @param onMetadataChange - Optional callback for when metadata changes
 * @param isCollapsible - Whether the panel should be collapsible
 * @param initialCollapsed - Whether the panel should start collapsed
 * @returns Object containing metadata state and operations
 */
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
          tagOperations.setTags(tagData || []);
          
          // Update source metadata state
          if (sourceData) {
            sourceMetadata.updateSourceMetadataState(sourceData);
          }
        });
      }
      
      panelState.finishLoading(true);
    } catch (err: any) {
      console.error("Error fetching metadata:", err);
      
      // Use standardized error handling
      handleError(err, "Failed to fetch metadata", {
        context: { contentId },
        level: "error"
      });
      
      panelState.finishLoading(false, err.message || "Failed to fetch metadata");
    }
  };

  // Fetch metadata when contentId changes
  useEffect(() => {
    console.log("MetadataPanel: contentId changed to", contentId);
    if (contentId) {
      fetchMetadata();
    }
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
