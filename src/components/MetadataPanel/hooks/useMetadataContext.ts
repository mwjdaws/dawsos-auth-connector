
import { useMemo } from 'react';
import { useMetadataPanel } from './useMetadataPanel';
import { OntologyTerm } from '@/hooks/markdown-editor/ontology-terms/types';
import { MetadataContextState } from '../types';

/**
 * Hook to access metadata context values and operations for a content item
 */
export function useMetadataContext(
  contentId: string,
  onMetadataChange?: () => void,
  isCollapsible?: boolean,
  initialCollapsed?: boolean
): MetadataContextState {
  const {
    tags,
    isLoading: loading,
    error,
    isPending,
    newTag,
    setNewTag,
    user,
    externalSourceUrl: externalSource,
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

  // Function to refresh metadata asynchronously
  const refreshTags = async () => {
    handleRefresh();
    // Return a promise that resolves after a short delay
    return new Promise<void>(resolve => setTimeout(resolve, 100));
  };

  // Function to set tags (wrapper for setting tags in the panel)
  const setTags = (newTags: any[]) => {
    // This is a placeholder - in a real implementation, we would
    // need to update the tags in the database or backend
    console.log('Setting tags:', newTags);
  };

  // Add a tag wrapper function that matches the interface
  const addTag = (tag: string) => {
    setNewTag(tag);
    handleAddTag();
  };

  // Memoize the context state to prevent unnecessary re-renders
  return useMemo(
    () => ({
      contentId,
      tags,
      domains: [], // This would come from actual data
      externalSource,
      ontologyTerms: [] as OntologyTerm[], // Properly typed empty array
      loading,
      error: error || null,
      setTags,
      addTag,
      removeTag: handleDeleteTag,
      refreshTags
    }),
    [
      contentId,
      tags,
      externalSource,
      loading,
      error,
      handleAddTag,
      handleDeleteTag
    ]
  );
}
