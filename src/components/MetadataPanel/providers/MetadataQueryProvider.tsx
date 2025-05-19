
import React from 'react';
import { MetadataProvider } from '../hooks/useMetadataContext';
import { useMetadataQuery } from '@/hooks/metadata/useMetadataQuery';
import { useTagsQuery } from '@/hooks/metadata/useTagsQuery';
import { useOntologyTermsQuery } from '@/hooks/metadata/useOntologyTermsQuery';
import { MetadataQueryProviderProps } from '../types';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';

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
  const { data: tagData = [], isLoading: isTagsLoading } = useTagsQuery(contentId, {
    includeTypeInfo: true
  });
  
  // Cast tagData to the correct type
  const tags: Tag[] = tagData as Tag[];
  
  // Fetch ontology terms
  const { data: ontologyData = [], isLoading: isOntologyLoading } = useOntologyTermsQuery(contentId);
  
  // Cast ontology data to the correct type
  const ontologyTerms: OntologyTerm[] = ontologyData as OntologyTerm[];
  
  // Combine loading states
  const isLoading = isMetadataLoading || isTagsLoading || isOntologyLoading;
  
  // Get domain information from metadata if available
  const domain = metadata && 'domain' in metadata ? metadata.domain : null;
  
  // Format external source information
  const externalSource = metadata ? {
    external_source_url: 'external_source_url' in metadata ? metadata.external_source_url : null,
    needs_external_review: 'needs_external_review' in metadata ? metadata.needs_external_review : false,
    external_source_checked_at: 'external_source_checked_at' in metadata ? metadata.external_source_checked_at : null
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
