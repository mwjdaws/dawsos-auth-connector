
// Import necessary hooks
import { useState, useEffect, useMemo } from 'react';
import { useSourceMetadata } from './useSourceMetadata';
import { useTagOperations } from './tag-operations/useTagOperations';
import { usePanelState } from './usePanelState';
import { MetadataPanelProps, SourceMetadata, Tag, OntologyTerm } from '../types';

export const useMetadataPanel = (props: MetadataPanelProps) => {
  const { contentId, onMetadataChange, isCollapsible, initialCollapsed } = props;
  
  // Use the tag operations hook
  const tagOperations = useTagOperations(contentId);
  
  // Use source metadata hook
  const sourceMetadata = useSourceMetadata({ contentId });
  
  // Panel state
  const panelState = usePanelState({ 
    contentId, 
    onMetadataChange,
    isCollapsible,
    initialCollapsed
  });

  // Ontology terms (mock for now, would typically come from another hook)
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  
  // Prepare validation result for panel content
  const validationResult = useMemo(() => ({
    contentExists: panelState.contentExists,
    isValid: !!contentId && typeof contentId === 'string'
  }), [contentId, panelState.contentExists]);
  
  // Create panel content
  const panelContent = useMemo(() => ({
    contentId,
    isLoading: sourceMetadata.isLoading || tagOperations.isLoading,
    error: sourceMetadata.error || tagOperations.error,
    data: sourceMetadata.data,
    validationResult,
    tags: tagOperations.tags,
    ontologyTerms
  }), [contentId, sourceMetadata, tagOperations, validationResult, ontologyTerms]);
  
  // Call onMetadataChange when data changes
  useEffect(() => {
    if (onMetadataChange && sourceMetadata.data) {
      onMetadataChange();
    }
  }, [sourceMetadata.data, onMetadataChange]);
  
  // Load content when necessary
  useEffect(() => {
    // Any initialization logic would go here
  }, [contentId]);
  
  // The derived panel content from usePanelContent
  const panelContentResult = useMemo(() => {
    const exists = panelState.contentExists;
    const isValid = !!contentId && typeof contentId === 'string';
    
    return {
      contentExists: exists,
      isValidContent: isValid,
      contentValidationResult: isValid ? 'valid' : 'invalid',
      metadata: sourceMetadata.data,
      tags: tagOperations.tags,
      ontologyTerms,
      isLoading: sourceMetadata.isLoading || tagOperations.isLoading,
      error: sourceMetadata.error || tagOperations.error,
      handleRefresh: () => {
        sourceMetadata.fetchSourceMetadata();
        tagOperations.handleRefresh();
      }
    };
  }, [contentId, sourceMetadata, tagOperations, panelState, ontologyTerms]);
  
  return {
    // Consolidate everything into a single object
    ...sourceMetadata,  
    handleRefresh: panelContentResult.handleRefresh,
    
    // Tag operations
    tags: tagOperations.tags,
    isTagsLoading: tagOperations.isLoading,
    tagsError: tagOperations.error,
    newTag: tagOperations.newTag,
    setNewTag: tagOperations.setNewTag,
    handleAddTag: tagOperations.handleAddTag,
    handleDeleteTag: tagOperations.handleDeleteTag,
    handleUpdateTagOrder: tagOperations.handleUpdateTagOrder,
    
    // Panel state
    ...panelState,
    
    // Panel content results
    ontologyTerms,
    contentId,
    
    // Include validation results
    contentExists: panelContentResult.contentExists,
    isValidContent: panelContentResult.isValidContent,
    contentValidationResult: panelContentResult.contentValidationResult,
  };
};
