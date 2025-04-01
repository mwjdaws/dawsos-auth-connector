
import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';
import { SourceMetadata, MetadataProviderProps } from '../types';
import { fetchSourceMetadata, fetchTags, fetchOntologyTerms } from '@/services/api/metadata';
import { useAuth } from '@/hooks/useAuth';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { useTagOperations } from '../hooks/tag-operations/useTagOperations';

// Context interface
export interface MetadataContextData {
  contentId: string;
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  sourceMetadata: SourceMetadata | null;
  isEditable: boolean;
  isLoading: boolean;
  error: Error | null;
  refreshMetadata: () => void;
  handleDeleteTag: (tagId: string) => Promise<void>;
}

// Create context
const MetadataContext = createContext<MetadataContextData | undefined>(undefined);

// Provider component
export const MetadataQueryProvider: React.FC<MetadataProviderProps> = ({ 
  contentId,
  editable = false,
  children 
}) => {
  const { user } = useAuth();
  const isValid = contentId && isValidContentId(contentId);
  
  // Source metadata query
  const { 
    data: sourceData,
    isLoading: isSourceLoading, 
    error: sourceError,
    refetch: refetchSource
  } = useQuery({
    queryKey: isValid ? ['metadata', 'source', contentId] : undefined,
    queryFn: () => fetchSourceMetadata(contentId),
    enabled: !!isValid,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Tags operations
  const {
    tags,
    isLoading: isTagsLoading,
    error: tagsError,
    handleRefresh: refreshTags,
    handleDeleteTag
  } = useTagOperations(contentId);
  
  // Ontology terms query
  const {
    data: ontologyTerms = [],
    isLoading: isOntologyLoading,
    error: ontologyError,
    refetch: refetchOntology
  } = useQuery({
    queryKey: isValid ? ['metadata', 'ontology', contentId] : undefined,
    queryFn: () => fetchOntologyTerms(contentId),
    enabled: !!isValid,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Combined loading and error states
  const isLoading = isSourceLoading || isTagsLoading || isOntologyLoading;
  const error = sourceError || tagsError || ontologyError || null;
  
  // Refresh all metadata
  const refreshMetadata = () => {
    if (isValid) {
      refetchSource();
      refreshTags();
      refetchOntology();
    }
  };
  
  // Context value
  const contextValue: MetadataContextData = {
    contentId,
    tags,
    ontologyTerms,
    sourceMetadata: sourceData,
    isEditable: editable,
    isLoading,
    error,
    refreshMetadata,
    handleDeleteTag
  };
  
  return (
    <MetadataContext.Provider value={contextValue}>
      {children}
    </MetadataContext.Provider>
  );
};

// Hook for accessing the metadata context
export function useMetadataContext() {
  const context = useContext(MetadataContext);
  
  if (!context) {
    throw new Error('useMetadataContext must be used within a MetadataQueryProvider');
  }
  
  return context;
}
