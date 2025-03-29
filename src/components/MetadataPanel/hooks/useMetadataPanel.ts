
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OntologyTerm } from '@/hooks/markdown-editor/ontology-terms/types';
import { useAuth } from '@/hooks/useAuth';

export interface MetadataPanelState {
  contentId: string;
  title: string;
  tags: string[];
  domains: string[];
  externalSource?: string;
  externalSourceUrl?: string;
  ontologyTerms: OntologyTerm[];
  loading: boolean;
  error: Error | null;
  isLoading: boolean;
  isPending: boolean;
  user: any;
  needsExternalReview: boolean;
  lastCheckedAt?: string;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  setTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  refreshTags: () => void;
  handleRefresh: () => void;
  handleAddTag: (tag: string) => void;
  handleDeleteTag: (tag: string) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
}

/**
 * Hook that manages metadata panel state
 */
export function useMetadataPanel(
  contentId?: string, 
  onMetadataChange?: () => void, 
  isCollapsible?: boolean, 
  initialCollapsed?: boolean
): MetadataPanelState {
  const [internalContentId, setInternalContentId] = useState(contentId || '');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [externalSource, setExternalSource] = useState<string | undefined>();
  const [externalSourceUrl, setExternalSourceUrl] = useState<string | undefined>();
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed || false);
  const [needsExternalReview, setNeedsExternalReview] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | undefined>();
  const [newTag, setNewTag] = useState('');
  
  const { user } = useAuth();

  // Load content metadata
  useEffect(() => {
    if (contentId) {
      setInternalContentId(contentId);
    }
    
    if (!internalContentId) return;
    
    const fetchMetadata = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('title, metadata, external_source_url, needs_external_review, external_source_checked_at')
          .eq('id', internalContentId)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setTitle(data.title || '');
          setTags((data.metadata?.tags || []) as string[]);
          setDomains((data.metadata?.domains || []) as string[]);
          setExternalSourceUrl(data.external_source_url || undefined);
          setNeedsExternalReview(data.needs_external_review || false);
          setLastCheckedAt(data.external_source_checked_at || undefined);
          
          // Fetch ontology terms
          const { data: termsData, error: termsError } = await supabase
            .from('knowledge_source_ontology_terms')
            .select(`
              id,
              ontology_term_id,
              ontology_terms:ontology_term_id (
                id, 
                term,
                description,
                domain
              )
            `)
            .eq('knowledge_source_id', internalContentId);
            
          if (termsError) throw termsError;
          
          setOntologyTerms(termsData?.map(item => ({
            associationId: item.id,
            id: item.ontology_terms.id,
            term: item.ontology_terms.term,
            description: item.ontology_terms.description,
            domain: item.ontology_terms.domain
          })) || []);
        }
      } catch (err) {
        console.error('Error loading metadata:', err);
        setError(err instanceof Error ? err : new Error('Failed to load metadata'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetadata();
  }, [internalContentId, contentId]);

  // Function to add a tag
  const addTag = useCallback((tag: string) => {
    if (!tags.includes(tag)) {
      setTags(prevTags => [...prevTags, tag]);
      saveTags([...tags, tag]);
    }
  }, [tags, internalContentId]);

  // Function to remove a tag
  const removeTag = useCallback((tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    saveTags(newTags);
  }, [tags, internalContentId]);

  // Save tags to database
  const saveTags = async (newTags: string[]) => {
    if (!internalContentId) return;
    
    setIsPending(true);
    try {
      const { error } = await supabase
        .from('knowledge_sources')
        .update({
          metadata: { tags: newTags, domains }
        })
        .eq('id', internalContentId);
        
      if (error) throw error;
      
      if (onMetadataChange) {
        onMetadataChange();
      }
    } catch (err) {
      console.error('Error saving tags:', err);
    } finally {
      setIsPending(false);
    }
  };

  // Function to refresh metadata
  const refreshTags = useCallback(() => {
    if (!internalContentId) return;
    
    setLoading(true);
    
    // Refresh metadata
    setTimeout(() => {
      setLoading(false);
      if (onMetadataChange) {
        onMetadataChange();
      }
    }, 500);
  }, [internalContentId, onMetadataChange]);

  // Handler for refresh button
  const handleRefresh = useCallback(() => {
    refreshTags();
  }, [refreshTags]);

  // Handler for adding a tag
  const handleAddTag = useCallback((tag: string) => {
    if (tag.trim()) {
      addTag(tag.trim());
      setNewTag('');
    }
  }, [addTag]);

  // Handler for deleting a tag
  const handleDeleteTag = useCallback((tag: string) => {
    removeTag(tag);
  }, [removeTag]);

  return {
    contentId: internalContentId,
    title,
    tags,
    domains,
    externalSource,
    externalSourceUrl,
    ontologyTerms,
    loading,
    error,
    isLoading: loading,
    isPending,
    user,
    needsExternalReview,
    lastCheckedAt,
    isCollapsed,
    setIsCollapsed,
    setTags,
    addTag,
    removeTag,
    refreshTags,
    handleRefresh,
    handleAddTag,
    handleDeleteTag,
    newTag,
    setNewTag
  };
}
