
// Import necessary hooks
import { useState, useEffect } from 'react';
import { useSourceMetadata } from './useSourceMetadata';
import { useTagOperations } from './tag-operations/useTagOperations';
import { User } from '@supabase/supabase-js';
import { usePanelState } from './usePanelState';
import { usePanelContent } from './usePanelContent';
import { MetadataPanelProps } from '../types';

export const useMetadataPanel = (props: MetadataPanelProps) => {
  const { contentId, user, onMetadataChange } = props;
  
  // Use the tag operations hook
  const tagOperations = useTagOperations(contentId);
  
  // Use source metadata hook
  const sourceMetadata = useSourceMetadata({ contentId });
  
  // Panel state and content
  const panelState = usePanelState({ contentId });
  const panelContent = usePanelContent({ 
    contentId, 
    isLoading: sourceMetadata.isLoading,
    error: sourceMetadata.error,
    data: sourceMetadata.data,
    validationResult: panelState.validationResult
  });
  
  // Call onMetadataChange when data changes
  useEffect(() => {
    if (onMetadataChange && sourceMetadata.data) {
      onMetadataChange();
    }
  }, [sourceMetadata.data, onMetadataChange]);
  
  return {
    // Source metadata
    ...sourceMetadata,
    
    // Tag operations
    tags: tagOperations.tags,
    isTagsLoading: tagOperations.isLoading,
    tagsError: tagOperations.error,
    newTag: tagOperations.newTag,
    setNewTag: tagOperations.setNewTag,
    handleAddTag: tagOperations.handleAddTag,
    handleDeleteTag: tagOperations.handleDeleteTag,
    handleUpdateTagOrder: tagOperations.handleUpdateTagOrder,
    
    // Panel state and content
    ...panelState,
    ...panelContent,
    
    // Other props
    contentId,
    user
  };
};
