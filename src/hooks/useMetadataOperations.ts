
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string;
}

export interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
  review_required: boolean;
}

export interface ExternalSourceMetadata {
  external_source_url: string | null;
  needs_external_review: boolean;
  external_source_checked_at: string | null;
}

export interface MetadataState {
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  externalSource: ExternalSourceMetadata | null;
  isLoading: boolean;
  error: Error | null;
}

export function useMetadataOperations(contentId?: string) {
  const [state, setState] = useState<MetadataState>({
    tags: [],
    ontologyTerms: [],
    externalSource: null,
    isLoading: false,
    error: null
  });

  // Fetch all metadata
  const fetchAllMetadata = async () => {
    if (!contentId) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Execute all queries in parallel
      const [tagsResult, ontologyTermsResult, externalSourceResult] = await Promise.all([
        fetchTags(),
        fetchOntologyTerms(),
        fetchExternalSource()
      ]);
      
      setState({
        tags: tagsResult || [],
        ontologyTerms: ontologyTermsResult || [],
        externalSource: externalSourceResult,
        isLoading: false,
        error: null
      });
      
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Unknown error fetching metadata') 
      }));
      
      toast({
        title: "Error",
        description: "Failed to load metadata",
        variant: "destructive",
      });
    }
  };

  // Fetch tags
  const fetchTags = async (): Promise<Tag[]> => {
    if (!contentId) return [];
    
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('content_id', contentId);
    
    if (error) throw error;
    return data || [];
  };

  // Fetch ontology terms
  const fetchOntologyTerms = async (): Promise<OntologyTerm[]> => {
    if (!contentId) return [];
    
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
  };

  // Fetch external source metadata
  const fetchExternalSource = async (): Promise<ExternalSourceMetadata | null> => {
    if (!contentId) return null;
    
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
  };

  // Add a tag
  const addTag = async (name: string, typeId?: string): Promise<Tag | null> => {
    if (!contentId || !name.trim()) return null;
    
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ 
          name: name.trim().toLowerCase(), 
          content_id: contentId,
          type_id: typeId 
        }])
        .select();
      
      if (error) throw error;
      
      // Update local state
      if (data && data.length > 0) {
        setState(prev => ({
          ...prev,
          tags: [...prev.tags, data[0]]
        }));
        
        toast({
          title: "Success",
          description: "Tag added successfully",
        });
        
        return data[0];
      }
      
      return null;
    } catch (error) {
      console.error("Error adding tag:", error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add tag",
        variant: "destructive",
      });
      
      return null;
    }
  };

  // Delete a tag
  const deleteTag = async (tagId: string): Promise<boolean> => {
    if (!contentId || !tagId) return false;
    
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);
      
      if (error) throw error;
      
      // Update local state
      setState(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag.id !== tagId)
      }));
      
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting tag:", error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete tag",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Assign ontology term
  const assignOntologyTerm = async (termId: string, reviewRequired: boolean = true): Promise<boolean> => {
    if (!contentId || !termId) return false;
    
    try {
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .insert([{ 
          knowledge_source_id: contentId, 
          ontology_term_id: termId,
          review_required: reviewRequired
        }])
        .select(`
          id,
          ontology_term_id,
          review_required,
          ontology_terms:ontology_term_id (
            id,
            term,
            description
          )
        `);
      
      if (error) throw error;
      
      // Update local state if insertion was successful
      if (data && data.length > 0) {
        const newTerm: OntologyTerm = {
          id: data[0].ontology_term_id,
          term: data[0].ontology_terms.term,
          description: data[0].ontology_terms.description,
          review_required: data[0].review_required
        };
        
        setState(prev => ({
          ...prev,
          ontologyTerms: [...prev.ontologyTerms, newTerm]
        }));
        
        toast({
          title: "Success",
          description: "Ontology term assigned successfully",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error assigning ontology term:", error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign ontology term",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Remove ontology term
  const removeOntologyTerm = async (termId: string): Promise<boolean> => {
    if (!contentId || !termId) return false;
    
    try {
      const { error } = await supabase
        .from('knowledge_source_ontology_terms')
        .delete()
        .eq('knowledge_source_id', contentId)
        .eq('ontology_term_id', termId);
      
      if (error) throw error;
      
      // Update local state
      setState(prev => ({
        ...prev,
        ontologyTerms: prev.ontologyTerms.filter(term => term.id !== termId)
      }));
      
      toast({
        title: "Success",
        description: "Ontology term removed successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error removing ontology term:", error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove ontology term",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Update external source metadata
  const updateExternalSource = async (
    externalSourceUrl: string | null,
    needsExternalReview: boolean = false
  ): Promise<boolean> => {
    if (!contentId) return false;
    
    try {
      const { error } = await supabase
        .from('knowledge_sources')
        .update({ 
          external_source_url: externalSourceUrl, 
          needs_external_review: needsExternalReview 
        })
        .eq('id', contentId);
      
      if (error) throw error;
      
      // Update local state
      setState(prev => ({
        ...prev,
        externalSource: {
          ...prev.externalSource!,
          external_source_url: externalSourceUrl,
          needs_external_review: needsExternalReview
        }
      }));
      
      toast({
        title: "Success",
        description: "External source metadata updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating external source metadata:", error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update external source metadata",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Return the state and operations
  return {
    ...state,
    fetchAllMetadata,
    fetchTags,
    fetchOntologyTerms,
    fetchExternalSource,
    addTag,
    deleteTag,
    assignOntologyTerm,
    removeOntologyTerm,
    updateExternalSource
  };
}
