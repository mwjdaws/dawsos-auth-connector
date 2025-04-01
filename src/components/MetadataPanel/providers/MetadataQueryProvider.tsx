
import React, { createContext, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/components/MetadataPanel/types';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { mapApiTagToTag } from '@/utils/api/tag-compatibility';

// Source metadata type
export interface SourceMetadata {
  id: string;
  title: string;
  content: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean;
  published: boolean;
  published_at: string | null;
  template_id: string | null;
  created_at: string;
  updated_at: string;
}

// Context value type
interface MetadataContextValue {
  // Content and validation state
  contentId: string;
  validationResult: { isValid: boolean; contentExists?: boolean; } | null;
  isEditable: boolean;
  
  // Metadata state
  sourceMetadata: SourceMetadata | null;
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  isLoading: boolean;
  error: Error | null;
  
  // Operations
  refreshMetadata?: () => void;
  handleAddTag?: (tag: string, typeId?: string | null) => Promise<void>;
  handleDeleteTag?: (tagId: string) => Promise<void>;
}

// Default context value
const defaultContextValue: MetadataContextValue = {
  contentId: '',
  validationResult: null,
  isEditable: false,
  sourceMetadata: null,
  tags: [],
  ontologyTerms: [],
  isLoading: false,
  error: null,
};

// Create context
export const MetadataContext = createContext<MetadataContextValue>(defaultContextValue);

interface MetadataProviderProps {
  contentId: string;
  editable?: boolean;
  children: React.ReactNode;
}

export function MetadataProvider({ 
  contentId, 
  editable = false,
  children 
}: MetadataProviderProps) {
  // State for metadata (source, tags, ontology terms)
  const [tags, setTags] = useState<Tag[]>([]);
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  
  // Check if contentId is valid
  const isValid = useMemo(() => isValidContentId(contentId), [contentId]);
  
  // Query for source metadata
  const { 
    data: sourceData,
    isLoading: isSourceLoading,
    error: sourceError,
    refetch: refetchSource
  } = useQuery({
    queryKey: ['metadata', 'source', contentId],
    queryFn: async () => {
      if (!contentId || !isValid) return null;
      
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('*')
        .eq('id', contentId)
        .single();
      
      if (error) throw error;
      return data as SourceMetadata;
    },
    enabled: Boolean(contentId && isValid),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Query for tags
  const {
    data: tagData,
    isLoading: isTagsLoading,
    error: tagsError,
    refetch: refetchTags
  } = useQuery({
    queryKey: ['metadata', 'tags', contentId],
    queryFn: async () => {
      if (!contentId || !isValid) return [];
      
      const { data, error } = await supabase
        .from('tags')
        .select('*, tag_types(name)')
        .eq('content_id', contentId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match the Tag interface
      return data.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        content_id: tag.content_id,
        type_id: tag.type_id,
        display_order: tag.display_order,
        type_name: tag.tag_types?.name || ''
      }));
    },
    enabled: Boolean(contentId && isValid),
    staleTime: 1000 * 60 * 5, // 5 minutes
    onSuccess: (data) => {
      setTags(data.map(mapApiTagToTag));
    }
  });
  
  // Query for ontology terms
  const {
    data: termData,
    isLoading: isTermsLoading,
    error: termsError,
    refetch: refetchTerms
  } = useQuery({
    queryKey: ['metadata', 'ontologyTerms', contentId],
    queryFn: async () => {
      if (!contentId || !isValid) return [];
      
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .select(`
          *,
          ontology_terms(*)
        `)
        .eq('knowledge_source_id', contentId);
      
      if (error) throw error;
      
      // Transform the data to match the OntologyTerm interface
      return data.map((item: any) => ({
        id: item.ontology_terms.id,
        term: item.ontology_terms.term,
        description: item.ontology_terms.description || '',
        domain: item.ontology_terms.domain || ''
      }));
    },
    enabled: Boolean(contentId && isValid),
    staleTime: 1000 * 60 * 5, // 5 minutes
    onSuccess: (data) => {
      setOntologyTerms(data);
    }
  });
  
  // Determine loading and error states
  const isLoading = isSourceLoading || isTagsLoading || isTermsLoading;
  const error = sourceError || tagsError || termsError || null;
  
  // Refresh all metadata
  const refreshMetadata = useCallback(() => {
    try {
      refetchSource();
      refetchTags();
      refetchTerms();
    } catch (err) {
      handleError(err, "Failed to refresh metadata");
    }
  }, [refetchSource, refetchTags, refetchTerms]);
  
  // Add tag
  const handleAddTag = useCallback(async (tagName: string, typeId?: string | null) => {
    if (!contentId || !isValid || !tagName.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: tagName.trim(),
          content_id: contentId,
          type_id: typeId || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new tag to the state
      setTags(prevTags => [
        ...prevTags, 
        {
          id: data.id,
          name: data.name,
          content_id: data.content_id,
          type_id: data.type_id,
          display_order: data.display_order || 0,
          type_name: ''
        }
      ]);
    } catch (err) {
      handleError(err, `Failed to add tag "${tagName}"`);
    }
  }, [contentId, isValid]);
  
  // Delete tag
  const handleDeleteTag = useCallback(async (tagId: string) => {
    if (!contentId || !isValid || !tagId) return;
    
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('content_id', contentId);
      
      if (error) throw error;
      
      // Remove the tag from the state
      setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
    } catch (err) {
      handleError(err, "Failed to delete tag");
    }
  }, [contentId, isValid]);
  
  // Create context value
  const contextValue = useMemo(() => ({
    contentId,
    validationResult: { isValid },
    isEditable: editable,
    sourceMetadata: sourceData,
    tags,
    ontologyTerms,
    isLoading,
    error,
    refreshMetadata,
    handleAddTag,
    handleDeleteTag
  }), [
    contentId,
    isValid,
    editable,
    sourceData,
    tags,
    ontologyTerms,
    isLoading,
    error,
    refreshMetadata,
    handleAddTag,
    handleDeleteTag
  ]);
  
  return (
    <MetadataContext.Provider value={contextValue}>
      {children}
    </MetadataContext.Provider>
  );
}
