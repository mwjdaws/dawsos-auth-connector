
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSourceMetadata } from '@/services/api/knowledgeSources';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';
import { SourceMetadata } from '@/types/sourceMetadata';
import { ValidationResult, ContentIdValidationResult } from '@/utils/validation/types';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { toSourceMetadata } from '@/types/sourceMetadata';
import { handleError, ErrorLevel } from '@/utils/errors';

/**
 * Props for the MetadataProvider component
 */
export interface MetadataProviderProps {
  contentId: string;
  editable?: boolean;
  children: React.ReactNode;
}

/**
 * Context for metadata state and operations
 */
interface MetadataContextType {
  contentId: string;
  isEditable: boolean;
  isLoading: boolean;
  error: Error | null;
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  sourceMetadata: SourceMetadata | null;
  validationResult: ValidationResult | null;
  refreshMetadata?: () => void;
  handleAddTag?: (name: string, typeId?: string | null) => Promise<void>;
  handleDeleteTag?: (id: string) => Promise<void>;
  handleReorderTags?: (tags: Tag[]) => Promise<void>;
  handleSetOntologyTerms?: (terms: OntologyTerm[]) => void;
}

// Create the context
const MetadataContext = createContext<MetadataContextType>({
  contentId: '',
  isEditable: false,
  isLoading: false,
  error: null,
  tags: [],
  ontologyTerms: [],
  sourceMetadata: null,
  validationResult: null
});

/**
 * Hook for accessing metadata context
 */
export const useMetadataContext = () => useContext(MetadataContext);

/**
 * Provider component for metadata state and operations
 */
export const MetadataProvider: React.FC<MetadataProviderProps> = ({
  contentId,
  editable = false,
  children
}) => {
  const queryClient = useQueryClient();
  
  // Local state
  const [tags, setTags] = useState<Tag[]>([]);
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  const [validationResult, setValidationResult] = useState<ContentIdValidationResult | null>(null);
  
  // Query for source metadata
  const { data: sourceMetadata, isLoading, error, refetch } = useQuery({
    queryKey: contentId ? ['metadata', 'source', contentId] : null,
    queryFn: async () => {
      try {
        const result = await fetchSourceMetadata(contentId);
        return toSourceMetadata(result);
      } catch (err) {
        handleError(err, `Failed to fetch metadata for content: ${contentId}`, {
          level: ErrorLevel.WARNING
        });
        throw err;
      }
    },
    enabled: !!contentId && isValidContentId(contentId)
  });
  
  // Validate the content ID on mount
  useEffect(() => {
    if (!contentId) {
      setValidationResult({
        isValid: false,
        contentExists: false,
        errorMessage: 'Content ID is required',
        message: 'Content ID is required',
        resultType: 'contentId'
      });
      return;
    }
    
    const isValid = isValidContentId(contentId);
    setValidationResult({
      isValid,
      contentExists: !!sourceMetadata,
      errorMessage: isValid ? null : 'Invalid content ID',
      message: isValid ? 'Valid content ID' : 'Invalid content ID',
      resultType: 'contentId'
    });
  }, [contentId, sourceMetadata]);
  
  // Create a function to handle fetching/refreshing all metadata
  const refreshMetadata = async () => {
    if (!contentId || !isValidContentId(contentId)) return;
    
    try {
      await refetch();
      
      // Additional refreshes for other metadata types could be added here
      
    } catch (err) {
      handleError(err, 'Error refreshing metadata', {
        level: ErrorLevel.WARNING
      });
    }
  };
  
  // Transform API response to tag array with the original structure
  useEffect(() => {
    if (sourceMetadata) {
      // Here you would typically fetch tags for this content ID
      // For simplicity, we're just using an empty array for now
      setTags([]);
    }
  }, [sourceMetadata]);
  
  // Transform API response to ontology terms array
  useEffect(() => {
    if (sourceMetadata) {
      // Here you would typically fetch ontology terms for this content ID
      // For simplicity, we're just using an empty array for now
      setOntologyTerms([]);
    }
  }, [sourceMetadata]);
  
  // Provide a function to add a tag
  const handleAddTag = async (name: string, typeId?: string | null) => {
    if (!contentId || !isValidContentId(contentId)) return;
    
    try {
      // Call your tag creation API here
      // For now this is a placeholder
      console.log(`Adding tag ${name} with type ${typeId} to content ${contentId}`);
      
      // Update local state
      setTags(prevTags => [...prevTags]);
      
    } catch (err) {
      handleError(err, 'Error adding tag', {
        level: ErrorLevel.WARNING
      });
    }
  };
  
  // Provide a function to delete a tag
  const handleDeleteTag = async (id: string) => {
    if (!contentId || !isValidContentId(contentId)) return;
    
    try {
      // Call your tag deletion API here
      // For now this is a placeholder
      console.log(`Deleting tag ${id} from content ${contentId}`);
      
      // Update local state
      setTags(prevTags => prevTags.filter(tag => tag.id !== id));
      
    } catch (err) {
      handleError(err, 'Error deleting tag', {
        level: ErrorLevel.WARNING
      });
    }
  };
  
  // Provide a function to reorder tags
  const handleReorderTags = async (reorderedTags: Tag[]) => {
    if (!contentId || !isValidContentId(contentId)) return;
    
    try {
      // Call your tag reordering API here
      // For now this is a placeholder
      console.log(`Reordering tags for content ${contentId}`);
      
      // Update local state
      setTags(reorderedTags);
      
    } catch (err) {
      handleError(err, 'Error reordering tags', {
        level: ErrorLevel.WARNING
      });
    }
  };
  
  // Provide a function to set ontology terms
  const handleSetOntologyTerms = (terms: OntologyTerm[]) => {
    setOntologyTerms(terms);
  };
  
  return (
    <MetadataContext.Provider
      value={{
        contentId,
        isEditable: editable,
        isLoading,
        error,
        tags,
        ontologyTerms,
        sourceMetadata: sourceMetadata || null,
        validationResult,
        refreshMetadata,
        handleAddTag: editable ? handleAddTag : undefined,
        handleDeleteTag: editable ? handleDeleteTag : undefined,
        handleReorderTags: editable ? handleReorderTags : undefined,
        handleSetOntologyTerms: editable ? handleSetOntologyTerms : undefined
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
};
