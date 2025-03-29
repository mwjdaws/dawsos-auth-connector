
/**
 * useMetadataContext Hook
 * 
 * Custom hook that provides access to the metadata context state and operations for a specific content.
 * It is a wrapper around useMetadataPanel that adds some additional functionality and memoizes the
 * results to prevent unnecessary re-renders.
 * 
 * @param contentId - The ID of the content for which to fetch metadata
 * @param onMetadataChange - Optional callback to be triggered when metadata changes
 * @param isCollapsible - Whether the metadata panel should be collapsible
 * @param initialCollapsed - Initial collapsed state if the panel is collapsible
 * 
 * @returns A memoized metadata context state object with all operations and properties
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const metadata = useMetadataContext('content-123');
 * 
 * // Access state
 * const { tags, isLoading } = metadata;
 * 
 * // Perform operations
 * metadata.handleAddTag();
 * metadata.refreshMetadata();
 * ```
 */

import { useMemo } from 'react';
import { useMetadataPanel } from './useMetadataPanel';
import { MetadataContextState } from '../types';

export function useMetadataContext(
  contentId: string,
  onMetadataChange?: () => void,
  isCollapsible?: boolean,
  initialCollapsed?: boolean
): MetadataContextState {
  // Get the base metadata state and operations from useMetadataPanel
  const metadataState = useMetadataPanel(
    contentId,
    onMetadataChange,
    isCollapsible,
    initialCollapsed
  );

  // Create a refreshMetadata function that returns a promise
  const refreshMetadata = async () => {
    metadataState.handleRefresh();
    return new Promise<void>((resolve) => {
      // Small delay to ensure the refresh operation has time to start
      setTimeout(() => {
        resolve();
      }, 100);
    });
  };

  // Determine if content is editable based on user presence
  const isEditable = !!metadataState.user;

  // Memoize the result to prevent unnecessary re-renders
  return useMemo(
    () => ({
      // Content info
      contentId,
      
      // Pass through all state from useMetadataPanel
      tags: metadataState.tags,
      newTag: metadataState.newTag,
      setNewTag: metadataState.setNewTag,
      handleAddTag: metadataState.handleAddTag,
      handleDeleteTag: metadataState.handleDeleteTag,
      externalSourceUrl: metadataState.externalSourceUrl,
      needsExternalReview: metadataState.needsExternalReview,
      lastCheckedAt: metadataState.lastCheckedAt,
      isLoading: metadataState.isLoading,
      error: metadataState.error,
      isPending: metadataState.isPending,
      isCollapsed: metadataState.isCollapsed,
      setIsCollapsed: metadataState.setIsCollapsed,
      
      // Additional computed properties
      isEditable,
      
      // Operations
      handleRefresh: metadataState.handleRefresh,
      refreshMetadata
    }),
    [
      contentId,
      metadataState.tags,
      metadataState.newTag,
      metadataState.externalSourceUrl,
      metadataState.needsExternalReview,
      metadataState.lastCheckedAt,
      metadataState.isLoading,
      metadataState.error,
      metadataState.isPending,
      metadataState.isCollapsed,
      isEditable
    ]
  );
}
