
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
    handleAddTag: addTag,
    handleDeleteTag: removeTag
  } = useMetadataPanel(contentId, onMetadataChange, isCollapsible, initialCollapsed);

  // Determine if content is editable based on user presence
  const isEditable = !!user;

  // Function to refresh metadata asynchronously
  const refreshTags = () => {
    handleRefresh();
    // Return a promise that resolves after a short delay
    return new Promise<void>(resolve => setTimeout(resolve, 100));
  };

  // Function to set tags (wrapper for setting tags in the panel)
  const setTags = (newTags: any[]) => {
    // Implementation would depend on how tags are managed
    console.log('Setting tags:', newTags);
  };

  // Memoize the context state to prevent unnecessary re-renders
  return useMemo(
    () => ({
      contentId,
      tags,
      domains: [], // This would come from actual data
      externalSource,
      ontologyTerms: [], // This would come from actual data
      loading,
      error: error || null,
      setTags,
      addTag,
      removeTag,
      refreshTags
    }),
    [
      contentId,
      tags,
      externalSource,
      loading,
      error,
      addTag,
      removeTag
    ]
  );
}
