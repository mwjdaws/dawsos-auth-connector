
import { useState, useCallback, useEffect, useRef } from 'react';
import { useSourceMetadata } from './useSourceMetadata';
import { useTagOperations } from './tag-operations/useTagOperations';
import { usePanelState } from './usePanelState';
import { MetadataPanelProps, OntologyTerm, Tag } from '../types';
import { safeCallback } from '@/utils/compatibility';

/**
 * Custom hook for managing the metadata panel state and operations
 */
export const useMetadataPanel = ({
  contentId,
  onMetadataChange = null,
  isCollapsible = false,
  initialCollapsed = false
}: MetadataPanelProps) => {
  // Panel state management
  const { 
    isCollapsed, 
    setIsCollapsed,
    contentExists,
    isCollapsible: isPanelCollapsible, 
    onMetadataChange: panelMetadataChange
  } = usePanelState({
    contentId,
    onMetadataChange,
    isCollapsible,
    initialCollapsed,
    contentExists: true
  });

  // Handle validation states
  const isValidContent = true; // Simplified for now
  const contentValidationResult = null; // Simplified for now

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
    contentId
  });

  // Source metadata update functions (simplified)
  const setExternalSourceUrl = () => {}; // Placeholder
  const setNeedsExternalReview = () => {}; // Placeholder
  const updateSourceMetadataState = () => {}; // Placeholder

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
    if (isMounted.current && onMetadataChange) {
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
      console.error('Error refreshing metadata:', err);
    }
  }, [contentId, isValidContent, fetchSourceMetadata, refreshTags, handleMetadataChange]);

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
    handleAddTag,
    handleDeleteTag,
    handleReorderTags,
    
    // User info (to be implemented)
    user: { id: 'user-1' },
    
    // Operations
    handleRefresh,
    handleMetadataChange,
    
    // Additional states for operations
    isAddingTag,
    isDeletingTag,
    isReordering,
    
    // Additional source operations
    fetchSourceMetadata,
    updateSourceMetadataState,
    setExternalSourceUrl,
    setNeedsExternalReview,
    
    // Empty ontology terms array (to be implemented)
    ontologyTerms: [] as OntologyTerm[]
  };
};
