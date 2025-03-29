
import { useMemo } from "react";
import { useMetadataPanel } from "./useMetadataPanel";
import { MetadataContextState } from "../types";

/**
 * Hook that exposes metadata panel state for other components to consume
 * 
 * This provides a unified API for interacting with metadata state and operations
 * without needing to directly use the useMetadataPanel hook.
 * 
 * @param contentId Content ID to get metadata for
 * @param onMetadataChange Optional callback when metadata changes
 * @param isCollapsible Whether the panel can be collapsed
 * @param initialCollapsed Whether the panel starts collapsed
 * @returns Metadata context state
 */
export const useMetadataContext = (
  contentId: string,
  onMetadataChange?: () => void,
  isCollapsible = false,
  initialCollapsed = false
): MetadataContextState => {
  const {
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
  } = useMetadataPanel(contentId, onMetadataChange, isCollapsible, initialCollapsed);

  // Determine if content is editable based on user presence
  const isEditable = !!user;

  // Create a function to refresh metadata that returns a promise
  const refreshMetadata = async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      handleRefresh();
      // Since handleRefresh is synchronous but triggers async operations,
      // we resolve after a short delay to allow state updates to propagate
      setTimeout(resolve, 100);
    });
  };

  // Memoize the context state to prevent unnecessary re-renders
  const contextState = useMemo<MetadataContextState>(
    () => ({
      contentId,
      tags,
      newTag,
      setNewTag,
      handleAddTag,
      handleDeleteTag,
      externalSourceUrl,
      needsExternalReview,
      lastCheckedAt,
      isLoading,
      error,
      isPending,
      isCollapsed,
      setIsCollapsed,
      isEditable,
      handleRefresh,
      refreshMetadata
    }),
    [
      contentId,
      tags,
      newTag,
      externalSourceUrl,
      needsExternalReview,
      lastCheckedAt,
      isLoading,
      error,
      isPending,
      isCollapsed,
      isEditable
    ]
  );

  return contextState;
};
