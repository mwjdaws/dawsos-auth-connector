
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { Tag } from '@/types/tag';
import { OntologyTerm, SourceMetadata } from '../types';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

// Define context types
interface MetadataContextValue {
  contentId: string;
  validationResult: { isValid: boolean };
  isEditable: boolean;
  sourceMetadata: SourceMetadata | null;
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  isLoading: boolean;
  error: Error | null;
  isSourceLoading: boolean;
  isTagsLoading: boolean;
  isOntologyLoading: boolean;
  refreshMetadata: () => void;
  handleDeleteTag: (tagId: string) => Promise<boolean>;
}

// Create context
const MetadataContext = createContext<MetadataContextValue | null>(null);

// Hook to use the context
export const useMetadataContext = () => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error('useMetadataContext must be used within a MetadataQueryProvider');
  }
  return context;
};

interface MetadataQueryProviderProps {
  contentId: string;
  editable?: boolean;
  children: ReactNode;
}

/**
 * Provider component that handles fetching and caching metadata using React Query
 */
export function MetadataQueryProvider({
  contentId,
  editable = false,
  children
}: MetadataQueryProviderProps) {
  // Check if the content ID is valid
  const isValid = isValidContentId(contentId);
  
  // Fetch source metadata
  const {
    data: sourceMetadata = null,
    isLoading: isSourceLoading,
    error: sourceError,
    refetch: refetchSource
  } = useQuery({
    queryKey: isValid ? ['metadata', 'source', contentId] : null,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('*')
          .eq('id', contentId)
          .single();
          
        if (error) throw error;
        return data as SourceMetadata;
      } catch (err) {
        console.error('Error fetching source metadata:', err);
        handleError(err, 'Failed to fetch source metadata');
        return null;
      }
    },
    enabled: isValid && !contentId.startsWith('temp-'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch tags
  const {
    data: tags = [],
    isLoading: isTagsLoading,
    error: tagsError,
    refetch: refetchTags
  } = useQuery({
    queryKey: isValid ? ['metadata', 'tags', contentId] : null,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('id, name, content_id, type_id, display_order, tag_types(name)')
          .eq('content_id', contentId)
          .order('display_order');
          
        if (error) throw error;
        
        // Transform data to match Tag interface
        return (data || []).map(tag => ({
          id: tag.id,
          name: tag.name,
          content_id: tag.content_id,
          type_id: tag.type_id,
          display_order: tag.display_order,
          type_name: tag.tag_types?.name || ''
        })) as Tag[];
      } catch (err) {
        console.error('Error fetching tags:', err);
        handleError(err, 'Failed to fetch tags');
        return [];
      }
    },
    enabled: isValid,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
  
  // Fetch ontology terms
  const {
    data: ontologyTerms = [],
    isLoading: isOntologyLoading,
    error: ontologyError,
    refetch: refetchOntology
  } = useQuery({
    queryKey: isValid ? ['metadata', 'ontology', contentId] : null,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('knowledge_source_ontology_terms')
          .select(`
            ontology_terms (
              id, term, description, domain
            )
          `)
          .eq('knowledge_source_id', contentId);
          
        if (error) throw error;
        
        // Transform the data to match OntologyTerm interface
        return (data || []).map(item => {
          const term = item.ontology_terms;
          return {
            id: term.id,
            term: term.term,
            description: term.description || '',
            domain: term.domain
          };
        }) as OntologyTerm[];
      } catch (err) {
        console.error('Error fetching ontology terms:', err);
        handleError(err, 'Failed to fetch ontology terms');
        return [];
      }
    },
    enabled: isValid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Handle tag deletion
  const handleDeleteTag = async (tagId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('content_id', contentId);
      
      if (error) throw error;
      
      // Refetch tags after deletion
      refetchTags();
      return true;
    } catch (err) {
      console.error('Error deleting tag:', err);
      handleError(err, 'Failed to delete tag');
      return false;
    }
  };
  
  // Combine loading and error states
  const isLoading = isSourceLoading || isTagsLoading || isOntologyLoading;
  const error = sourceError || tagsError || ontologyError || null;
  
  // Function to refresh all metadata
  const refreshMetadata = () => {
    refetchSource();
    refetchTags();
    refetchOntology();
  };
  
  // Create context value
  const contextValue = useMemo(() => ({
    contentId,
    validationResult: { isValid },
    isEditable: editable,
    sourceMetadata,
    tags,
    ontologyTerms,
    isLoading,
    error,
    isSourceLoading,
    isTagsLoading,
    isOntologyLoading,
    refreshMetadata,
    handleDeleteTag
  }), [
    contentId,
    isValid,
    editable,
    sourceMetadata,
    tags,
    ontologyTerms,
    isLoading,
    error,
    isSourceLoading,
    isTagsLoading,
    isOntologyLoading,
    refreshMetadata,
    handleDeleteTag
  ]);
  
  return (
    <MetadataContext.Provider value={contextValue}>
      {children}
    </MetadataContext.Provider>
  );
}
