
import { useEffect, useState, useRef, useTransition } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTagOperations } from './useTagOperations';
import { useSourceMetadata } from './useSourceMetadata';
import { usePanelState } from './usePanelState';
import { isValidContentId } from '@/utils/content-validation';

export function useMetadataPanel(
  contentId: string,
  onMetadataChange?: () => void,
  isCollapsible = false,
  initialCollapsed = false
) {
  const { user } = useAuth();
  const {
    tags,
    setTags,
    newTag,
    setNewTag,
    fetchTags,
    handleAddTag,
    handleDeleteTag
  } = useTagOperations({ 
    contentId, 
    user, 
    onMetadataChange 
  });

  const sourceMetadata = useSourceMetadata({ contentId });
  
  const {
    isLoading,
    error,
    isPending,
    startTransition,
    isCollapsed,
    setIsCollapsed,
    toggleCollapsed,
    isMounted,
    validateContentId,
    startLoading,
    finishLoading
  } = usePanelState(isCollapsible, initialCollapsed);

  // Function to fetch metadata
  const fetchMetadata = async () => {
    // Validate contentId
    if (!validateContentId(contentId)) return;
    
    // Start loading state
    startLoading();
    
    try {
      // Fetch tags and source metadata concurrently
      const tagsResult = await fetchTags();
      const sourceResult = await sourceMetadata.fetchSourceMetadata();
      
      // Update state in a non-blocking way
      startTransition(() => {
        // If the component is still mounted
        if (isMounted.current) {
          // Update tags safely if we got a valid response
          if (Array.isArray(tagsResult)) {
            setTags(tagsResult);
          }
          
          // Update source metadata state
          if (typeof sourceResult === 'object' && sourceResult !== null) {
            sourceMetadata.updateSourceMetadataState(sourceResult);
          }
          
          // Finish loading
          finishLoading(true);
          
          // Notify parent component of metadata change
          if (onMetadataChange) {
            onMetadataChange();
          }
        }
      });
    } catch (err) {
      console.error('Error fetching metadata:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching metadata';
      finishLoading(false, errorMessage);
    }
  };

  // Handle refresh action
  const handleRefresh = () => {
    fetchMetadata();
  };

  // Initial fetch when component mounts or contentId changes
  useEffect(() => {
    if (contentId) {
      fetchMetadata();
    }
  }, [contentId]);

  return {
    tags,
    isLoading,
    error,
    isPending,
    newTag,
    setNewTag,
    user,
    externalSourceUrl: sourceMetadata.externalSourceUrl,
    needsExternalReview: sourceMetadata.needsExternalReview,
    lastCheckedAt: sourceMetadata.lastCheckedAt,
    isCollapsed,
    setIsCollapsed,
    handleRefresh,
    handleAddTag,
    handleDeleteTag
  };
}
