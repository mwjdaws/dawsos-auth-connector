
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';
import { SourceMetadata, toSourceMetadata } from '@/types/sourceMetadata';
import { handleError } from '@/utils/errors';

/**
 * Context type for metadata operations
 */
export interface MetadataContextType {
  contentId: string;
  isEditable: boolean;
  isLoading: boolean;
  error: Error | null;
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  sourceMetadata: SourceMetadata | null;
  refreshMetadata: () => void;
  handleAddTag: (name: string, typeId?: string | null) => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleSetOntologyTerms: (terms: OntologyTerm[]) => void;
  validationResult: any;
}

/**
 * Default context values
 */
const defaultContext: MetadataContextType = {
  contentId: '',
  isEditable: false,
  isLoading: false,
  error: null,
  tags: [],
  ontologyTerms: [],
  sourceMetadata: null,
  refreshMetadata: () => {},
  handleAddTag: async () => {},
  handleDeleteTag: async () => {},
  handleSetOntologyTerms: () => {},
  validationResult: null
};

// Create context
const MetadataContext = createContext<MetadataContextType>(defaultContext);

/**
 * Props for the MetadataProvider component
 */
interface MetadataProviderProps {
  contentId: string;
  editable?: boolean;
  children: React.ReactNode;
}

/**
 * MetadataProvider component - provides metadata context to its children
 */
export function MetadataProvider({ contentId, editable = false, children }: MetadataProviderProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  
  // Fetch source metadata
  const {
    data: sourceMetadata,
    isLoading: isSourceLoading,
    error: sourceError,
    refetch: refetchSource
  } = useQuery({
    queryKey: contentId ? ['metadata', 'source', contentId] : undefined,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('*')
          .eq('id', contentId)
          .single();
          
        if (error) throw error;
        return toSourceMetadata(data);
      } catch (err) {
        handleError(err, `Failed to fetch metadata for source: ${contentId}`);
        return null;
      }
    },
    enabled: !!contentId,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Fetch tags for the content
  const {
    isLoading: isTagsLoading,
    error: tagsError,
    refetch: refetchTags
  } = useQuery({
    queryKey: contentId ? ['metadata', 'tags', contentId] : undefined,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('*')
          .eq('content_id', contentId)
          .order('display_order', { ascending: true });
          
        if (error) throw error;
        setTags(data || []);
        return data;
      } catch (err) {
        handleError(err, `Failed to fetch tags for content: ${contentId}`);
        return [];
      }
    },
    enabled: !!contentId,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Fetch ontology terms for the content
  const {
    isLoading: isTermsLoading,
    error: termsError,
    refetch: refetchTerms
  } = useQuery({
    queryKey: contentId ? ['metadata', 'terms', contentId] : undefined,
    queryFn: async () => {
      try {
        // Query knowledge_source_ontology_terms to get term IDs
        const { data: termAssociations, error: associationsError } = await supabase
          .from('knowledge_source_ontology_terms')
          .select('ontology_term_id')
          .eq('knowledge_source_id', contentId);
          
        if (associationsError) throw associationsError;
        
        if (!termAssociations || termAssociations.length === 0) {
          setOntologyTerms([]);
          return [];
        }
        
        // Extract term IDs
        const termIds = termAssociations.map(a => a.ontology_term_id);
        
        // Query actual term data
        const { data: terms, error: termsError } = await supabase
          .from('ontology_terms')
          .select('*')
          .in('id', termIds);
          
        if (termsError) throw termsError;
        
        setOntologyTerms(terms || []);
        return terms;
      } catch (err) {
        handleError(err, `Failed to fetch ontology terms for content: ${contentId}`);
        return [];
      }
    },
    enabled: !!contentId,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Add a tag to the content
  const handleAddTag = useCallback(async (name: string, typeId?: string | null) => {
    if (!contentId || !name.trim()) return;
    
    try {
      // Insert the new tag
      const { data, error } = await supabase
        .from('tags')
        .insert([
          {
            name: name.trim(),
            content_id: contentId,
            type_id: typeId || null,
            display_order: tags.length
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Update local state
      if (data && data[0]) {
        setTags(prev => [...prev, data[0] as Tag]);
      }
    } catch (err) {
      handleError(err, `Failed to add tag "${name}" to content: ${contentId}`);
    }
  }, [contentId, tags.length]);
  
  // Delete a tag from the content
  const handleDeleteTag = useCallback(async (tagId: string) => {
    if (!contentId || !tagId) return;
    
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('content_id', contentId);
        
      if (error) throw error;
      
      // Update local state
      setTags(prev => prev.filter(tag => tag.id !== tagId));
    } catch (err) {
      handleError(err, `Failed to delete tag from content: ${contentId}`);
    }
  }, [contentId]);
  
  // Set ontology terms
  const handleSetOntologyTerms = useCallback((terms: OntologyTerm[]) => {
    setOntologyTerms(terms);
  }, []);
  
  // Refresh all metadata
  const refreshMetadata = useCallback(() => {
    refetchSource();
    refetchTags();
    refetchTerms();
  }, [refetchSource, refetchTags, refetchTerms]);
  
  // Combine loading and error states
  const isLoading = isSourceLoading || isTagsLoading || isTermsLoading;
  const error = sourceError || tagsError || termsError || null;
  
  // Mock validation result for now - proper validation would be implemented in a real app
  const validationResult = { isValid: true, contentExists: !!sourceMetadata };
  
  const contextValue: MetadataContextType = {
    contentId,
    isEditable: editable,
    isLoading,
    error,
    tags,
    ontologyTerms,
    sourceMetadata,
    refreshMetadata,
    handleAddTag,
    handleDeleteTag,
    handleSetOntologyTerms,
    validationResult
  };
  
  return (
    <MetadataContext.Provider value={contextValue}>
      {children}
    </MetadataContext.Provider>
  );
}

/**
 * Custom hook to use metadata context
 */
export function useMetadataContext() {
  const context = useContext(MetadataContext);
  
  if (!context) {
    throw new Error('useMetadataContext must be used within a MetadataProvider');
  }
  
  return context;
}
