
/**
 * Hook for fetching metadata related to content
 */
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tag } from "@/types/tag";
import { OntologyTerm } from "@/components/MetadataPanel/types";
import { ExternalSourceMetadata } from "./useMetadataBase";
import { handleError } from "@/utils/error-handling";

interface UseFetchMetadataProps {
  contentId?: string;
  setTags: (tags: Tag[]) => void;
  setOntologyTerms: (terms: OntologyTerm[]) => void;
  setExternalSource: (source: ExternalSourceMetadata | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

/**
 * Hook for fetching various metadata
 */
export function useFetchMetadata({
  contentId,
  setTags,
  setOntologyTerms,
  setExternalSource,
  setLoading,
  setError
}: UseFetchMetadataProps) {
  
  /**
   * Fetch all metadata in parallel
   */
  const fetchAllMetadata = useCallback(async () => {
    if (!contentId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Execute all queries in parallel
      const [tagsResult, ontologyTermsResult, externalSourceResult] = await Promise.all([
        fetchTags(),
        fetchOntologyTerms(),
        fetchExternalSource()
      ]);
      
      setTags(tagsResult || []);
      setOntologyTerms(ontologyTermsResult || []);
      setExternalSource(externalSourceResult);
      setLoading(false);
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error fetching metadata');
      console.error("Error fetching metadata:", err);
      setError(err);
      setLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to load metadata",
        variant: "destructive",
      });
    }
  }, [contentId, setTags, setOntologyTerms, setExternalSource, setLoading, setError]);

  /**
   * Fetch tags for the content
   */
  const fetchTags = useCallback(async (): Promise<Tag[]> => {
    if (!contentId) return [];
    
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('content_id', contentId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "Failed to fetch tags", { 
        level: "warning", 
        technical: true,
        contentId
      });
      return [];
    }
  }, [contentId]);

  /**
   * Fetch ontology terms
   */
  const fetchOntologyTerms = useCallback(async (): Promise<OntologyTerm[]> => {
    if (!contentId) return [];
    
    try {
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .select(`
          id,
          ontology_term_id,
          review_required,
          ontology_terms:ontology_term_id (
            id,
            term,
            description
          )
        `)
        .eq('knowledge_source_id', contentId);
      
      if (error) throw error;
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        id: item.ontology_term_id,
        term: item.ontology_terms.term,
        description: item.ontology_terms.description,
        review_required: item.review_required
      }));
    } catch (error) {
      handleError(error, "Failed to fetch ontology terms", { 
        level: "warning", 
        technical: true,
        contentId
      });
      return [];
    }
  }, [contentId]);

  /**
   * Fetch external source metadata
   */
  const fetchExternalSource = useCallback(async (): Promise<ExternalSourceMetadata | null> => {
    if (!contentId) return null;
    
    try {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('external_source_url, needs_external_review, external_source_checked_at')
        .eq('id', contentId)
        .maybeSingle(); // Using maybeSingle() instead of single() to avoid errors when no rows are returned
      
      if (error) throw error;
      
      return data ? {
        external_source_url: data.external_source_url,
        needs_external_review: data.needs_external_review || false,
        external_source_checked_at: data.external_source_checked_at
      } : null;
    } catch (error) {
      handleError(error, "Failed to fetch external source metadata", { 
        level: "warning", 
        technical: true,
        contentId
      });
      return null;
    }
  }, [contentId]);

  return {
    fetchAllMetadata,
    fetchTags,
    fetchOntologyTerms,
    fetchExternalSource
  };
}
