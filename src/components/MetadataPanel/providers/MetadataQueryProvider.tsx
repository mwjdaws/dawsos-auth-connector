
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tag } from '@/types/tag';
import { OntologyTerm, MetadataProviderProps, SourceMetadata } from '../types';
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
  // State for ontology terms and source metadata
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  const [sourceMetadata, setSourceMetadata] = useState<SourceMetadata | null>(null);
  
  // Tags operations
  const {
    tags,
    isLoading: isTagsLoading,
    error: tagsError,
    handleRefresh: refreshTags,
    handleDeleteTag
  } = useTagOperations(contentId);

  // For simplicity, we're using the tag loading state for now
  const isLoading = isTagsLoading;
  const error = tagsError;
  
  // Refresh all metadata
  const refreshMetadata = () => {
    refreshTags();
    // Additional refresh logic would go here
  };
  
  // Load metadata when contentId changes
  useEffect(() => {
    refreshMetadata();
  }, [contentId]);
  
  // Context value
  const contextValue: MetadataContextData = {
    contentId,
    tags,
    ontologyTerms,
    sourceMetadata,
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
