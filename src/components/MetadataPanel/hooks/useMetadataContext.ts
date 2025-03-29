
/**
 * useMetadataContext Hook
 * 
 * Provides access to metadata state and operations from anywhere in the component tree.
 * Use this hook to access metadata outside of the MetadataPanel component.
 * 
 * @example
 * ```tsx
 * const metadata = useMetadataContext("content-123");
 * 
 * // Access metadata state
 * console.log(metadata.tags);
 * 
 * // Perform operations
 * metadata.handleAddTag();
 * metadata.handleDeleteTag(tagId);
 * 
 * // Refresh metadata
 * metadata.refreshMetadata();
 * ```
 * 
 * @param contentId - The ID of the content to get metadata for
 * @returns Object containing metadata state and operations
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
