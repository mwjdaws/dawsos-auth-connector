
import { useState, useCallback, useEffect, useRef } from 'react';
import { useSourceMetadata } from './useSourceMetadata';
import { useTagOperations } from './tag-operations/useTagOperations';
import { usePanelState } from './usePanelState';
import { MetadataPanelProps } from '../types';
import { safeCallback } from '@/utils/compatibility';
import { useContentValidator } from '@/hooks/validation/useContentValidator';
import { createComponentErrorHandler, tryAction } from '@/utils/errors/wrappers';
import { ContentValidationResult } from '@/utils/validation/types';

// Component-specific error handler
const handleError = createComponentErrorHandler('MetadataPanel');

/**
 * Custom hook for managing the metadata panel state and operations
 */
export const useMetadataPanel = ({
  contentId,
  onMetadataChange = null,
  isCollapsible = false,
  initialCollapsed = false
}: MetadataPanelProps) => {
  // Validate the content ID
  const contentValidationResult = useContentValidator(contentId);
  const isValidContent = contentValidationResult.isValid;
  const contentExists = contentValidationResult.contentExists;
  
  // Panel state management
  const { 
    isCollapsed, 
    setIsCollapsed,
    isCollapsible: isPanelCollapsible, 
    onMetadataChange: panelMetadataChange
  } = usePanelState({
    contentId,
    onMetadataChange,
    isCollapsible,
    initialCollapsed,
    contentExists
  });

  // Source metadata management
  const {
    externalSourceUrl,
    needsExternalReview,
    lastCheckedAt,
    isLoading: isSourceLoading,
    error: sourceError,
    data: sourceData,
    fetchSourceMetadata
  } = useSourceMetadata({
    contentId,
    enabled: isValidContent
  });

  // Tag operations management
  const {
    tags,
    isLoading: isTagsLoading,
    error: tagsError,
    newTag,
    setNewTag,
    handleAddTag,
    handleDeleteTag,
    handleReorderTags,
    handleRefresh: refreshTags,
    isAddingTag,
    isDeletingTag,
    isReordering
  } = useTagOperations(contentId);

  // Combined loading and error states
  const isLoading = isSourceLoading || isTagsLoading;
  const error = sourceError || tagsError;

  // Mounted ref to prevent updates on unmounted component
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle metadata changes
  const handleMetadataChange = useCallback(() => {
    if (isMounted.current && typeof onMetadataChange === 'function') {
      onMetadataChange();
    }
  }, [onMetadataChange]);

  // Refresh all metadata
  const handleRefresh = useCallback(async () => {
    if (!contentId || !isValidContent) return;
    
    try {
      await Promise.all([
        fetchSourceMetadata(),
        refreshTags()
      ]);
      
      handleMetadataChange();
    } catch (err) {
      handleError(err, 'Error refreshing metadata', {
        context: { contentId },
        level: 'warning'
      });
    }
  }, [contentId, isValidContent, fetchSourceMetadata, refreshTags, handleMetadataChange]);

  // Safe add tag with error handling
  const safeAddTag = useCallback(async (tagName: string, typeId?: string | null) => {
    return tryAction(
      () => handleAddTag(tagName, typeId),
      `Failed to add tag "${tagName}"`,
      { context: { contentId, tagName, typeId } }
    );
  }, [contentId, handleAddTag]);

  // Safe delete tag with error handling
  const safeDeleteTag = useCallback(async (tagId: string) => {
    return tryAction(
      () => handleDeleteTag(tagId),
      `Failed to delete tag`,
      { context: { contentId, tagId } }
    );
  }, [contentId, handleDeleteTag]);

  // Initialize data on mount and when contentId changes
  useEffect(() => {
    if (contentId && isValidContent) {
      handleRefresh();
    }
  }, [contentId, isValidContent, handleRefresh]);

  return {
    // Content validation properties
    contentId,
    contentExists,
    isValidContent,
    contentValidationResult,
    
    // Panel state
    isCollapsed,
    setIsCollapsed,
    isCollapsible: isPanelCollapsible,
    
    // Loading and error states
    isLoading,
    error,
    
    // Source metadata
    externalSourceUrl,
    needsExternalReview,
    lastCheckedAt,
    data: sourceData,
    
    // Tag operations
    tags,
    newTag,
    setNewTag,
    handleAddTag: safeAddTag,
    handleDeleteTag: safeDeleteTag,
    handleReorderTags,
    
    // Operations
    handleRefresh,
    handleMetadataChange,
    
    // Additional states for operations
    isAddingTag,
    isDeletingTag,
    isReordering
  };
};
