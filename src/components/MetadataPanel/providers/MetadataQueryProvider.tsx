
import React from 'react';
import { MetadataProvider } from '../hooks/useMetadataContext';
import { useMetadataQuery } from '@/hooks/metadata/useMetadataQuery';
import { useTagsQuery } from '@/hooks/metadata/useTagsQuery';
import { useOntologyTermsQuery } from '@/hooks/metadata/useOntologyTermsQuery';
import { MetadataQueryProviderProps } from '../types';

/**
 * MetadataQueryProvider Component
 * 
 * Provides metadata context data fetched from the backend
 */
export function MetadataQueryProvider({ 
  contentId, 
  editable, 
  children 
}: MetadataQueryProviderProps) {
  // Fetch metadata
  const { data: metadata, isLoading: isMetadataLoading, error: metadataError } = useMetadataQuery(contentId);
  
  // Fetch tags
  const { data: tags = [], isLoading: isTagsLoading } = useTagsQuery(contentId, {
    includeTypeInfo: true
  });
  
  // Fetch ontology terms
  const { data: ontologyTerms = [], isLoading: isOntologyLoading } = useOntologyTermsQuery(contentId);
  
  // Combine loading states
  const isLoading = isMetadataLoading || isTagsLoading || isOntologyLoading;
  
  // Get domain information from metadata if available
  const domain = metadata?.domain || null;
  
  // Format external source information
  const externalSource = metadata ? {
    external_source_url: metadata.external_source_url,
    needs_external_review: metadata.needs_external_review,
    external_source_checked_at: metadata.external_source_checked_at
  } : null;
  
  // Create context value
  const contextValue = {
    contentId,
    tags,
    ontologyTerms,
    domain,
    externalSource,
    isEditable: editable,
    isLoading,
    error: metadataError
  };
  
  return (
    <MetadataProvider value={contextValue}>
      {children}
    </MetadataProvider>
  );
}
