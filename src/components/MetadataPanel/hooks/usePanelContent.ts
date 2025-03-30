
/**
 * usePanelContent Hook
 * 
 * Custom hook that manages content-related state and operations for the metadata panel.
 * Extracts functionality from the main MetadataPanel component for better modularity.
 * 
 * @param contentId - The ID of the content to manage
 * @param onMetadataChange - Optional callback for metadata changes
 * @returns Content state and operations
 */
import { useState, useCallback } from 'react';
import { useTagsQuery, useOntologyTermsQuery, useMetadataQuery, useContentExists } from '@/hooks/metadata';
import { ContentIdValidationResult, getContentIdValidationResult } from '@/utils/content-validation';

export function usePanelContent(
  contentId?: string, 
  onMetadataChange?: () => void,
  showOntologyTerms = true
) {
  // Get content validation result
  const contentValidationResult = contentId 
    ? getContentIdValidationResult(contentId) 
    : ContentIdValidationResult.MISSING;
  
  // Check if the content ID is valid
  const isValidContent = contentValidationResult === ContentIdValidationResult.VALID;
  
  // Check if the content exists in the database
  const { data: contentExists = false } = useContentExists(
    isValidContent ? contentId : undefined
  );
  
  // Fetch metadata
  const { 
    data: metadata, 
    isLoading: isLoadingMetadata, 
    error: metadataError,
    refetch: refetchMetadata
  } = useMetadataQuery(
    isValidContent ? contentId : undefined
  );
  
  // Fetch tags
  const { 
    data: tags = [], 
    isLoading: isLoadingTags,
    error: tagsError,
    refetch: refetchTags
  } = useTagsQuery(
    isValidContent ? contentId : undefined
  );
  
  // Fetch ontology terms
  const {
    data: ontologyTerms = [],
    isLoading: isLoadingOntology,
    error: ontologyError,
    refetch: refetchOntology
  } = useOntologyTermsQuery(
    isValidContent && showOntologyTerms ? contentId : undefined,
    { enabled: showOntologyTerms }
  );
  
  // Handle refresh action
  const handleRefresh = useCallback(() => {
    refetchMetadata();
    refetchTags();
    if (showOntologyTerms) {
      refetchOntology();
    }
    
    if (onMetadataChange) {
      onMetadataChange();
    }
  }, [refetchMetadata, refetchTags, refetchOntology, showOntologyTerms, onMetadataChange]);
  
  return {
    contentExists,
    isValidContent,
    contentValidationResult,
    metadata,
    tags,
    ontologyTerms,
    isLoading: isLoadingMetadata || isLoadingTags || isLoadingOntology,
    error: metadataError || tagsError || ontologyError,
    handleRefresh
  };
}
