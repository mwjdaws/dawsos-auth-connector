import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback
} from 'react';
import { useTagsQuery, useTagMutations } from '@/hooks/metadata';
import { useMetadataQuery } from '@/hooks/metadata/useMetadataQuery';
import { useOntologyTermsQuery } from '@/hooks/metadata/useOntologyTermsQuery';
import { createContentIdValidationResult } from '@/utils/validation/contentIdValidation';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';
import { MetadataContextProps, MetadataPanelProps, SourceMetadata } from '../types';
import { ValidationResult } from '@/utils/validation/types';

interface MetadataProviderProps extends MetadataPanelProps {
  children: ReactNode;
}

// Create the MetadataContext
const MetadataContext = createContext<MetadataContextProps | undefined>(undefined);

// Create a provider component for the MetadataContext
export const MetadataProvider: React.FC<MetadataProviderProps> = ({
  contentId,
  editable = false,
  showOntologyTerms = false,
  showDomain = false,
  domain = null,
  className,
  onMetadataChange,
  initialCollapsed = false,
  isCollapsible = false,
  children
}) => {
  // Validate contentId and set initial state
  const [isValidContentId, setValidContentId] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  
  useEffect(() => {
    const validation = createContentIdValidationResult(contentId);
    setValidContentId(validation.isValid);
    setValidationResult(validation);
  }, [contentId]);
  
  // Fetch source metadata
  const {
    data: sourceMetadata,
    isLoading: isMetadataLoading,
    error: metadataError,
    refresh: refreshMetadata
  } = useMetadataQuery(contentId, {
    enabled: isValidContentId
  });
  
  // Fetch tags
  const {
    data: tagsData = [],
    isLoading: isTagsLoading,
    error: tagsError,
    refetch: fetchTags
  } = useTagsQuery(contentId, {
    enabled: isValidContentId
  });
  
  // Ensure we're working with the Tag type
  const tags: Tag[] = tagsData as Tag[];
  
  // Fetch ontology terms
  const {
    data: ontologyTermsData = [],
    isLoading: isOntologyTermsLoading,
    error: ontologyTermsError
  } = useOntologyTermsQuery(contentId, {
    enabled: isValidContentId && showOntologyTerms
  });
  
  // Ensure we're working with the OntologyTerm type
  const ontologyTerms: OntologyTerm[] = ontologyTermsData as OntologyTerm[];
  
  // Tag mutations
  const {
    addTag,
    deleteTag,
    isAddingTag,
    isDeletingTag
  } = useTagMutations();
  
  // Handle add tag
  const handleAddTag = async (tagName: string, typeId?: string | null) => {
    if (!tagName.trim()) return;
    
    await addTag({
      contentId,
      name: tagName,
      typeId: typeId || null
    });
    
    // Refresh tags after adding
    await fetchTags();
    
    if (onMetadataChange) {
      onMetadataChange();
    }
  };
  
  // Handle delete tag
  const handleDeleteTag = async (tagId: string) => {
    await deleteTag({
      tagId,
      contentId
    });
    
    // Refresh tags after deleting
    await fetchTags();
    
    if (onMetadataChange) {
      onMetadataChange();
    }
  };
  
  const isLoading = isMetadataLoading || isTagsLoading || isOntologyTermsLoading;
  const error = metadataError || tagsError || ontologyTermsError;
  
  const value: MetadataContextProps = {
    contentId,
    tags,
    validationResult: validationResult,
    isEditable: editable,
    isLoading,
    error,
    ontologyTerms,
    sourceMetadata,
    refreshMetadata,
    fetchTags,
    handleAddTag: handleAddTag,
    handleDeleteTag: handleDeleteTag
  };
  
  return (
    <MetadataContext.Provider value={value}>
      {children}
    </MetadataContext.Provider>
  );
};

// Create a hook to use the MetadataContext
export const useMetadataContext = (): MetadataContextProps => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error('useMetadataContext must be used within a MetadataProvider');
  }
  return context;
};
