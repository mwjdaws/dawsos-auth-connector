
/**
 * Hook for ontology term operations
 */
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { OntologyTerm } from "@/components/MetadataPanel/types";
import { handleError } from "@/utils/error-handling";

interface UseOntologyTermOperationsProps {
  contentId?: string;
  ontologyTerms: OntologyTerm[];
  setOntologyTerms: (terms: OntologyTerm[]) => void;
}

/**
 * Hook for ontology term operations
 */
export function useOntologyTermOperations({
  contentId,
  ontologyTerms,
  setOntologyTerms
}: UseOntologyTermOperationsProps) {
  
  /**
   * Assign an ontology term to the content
   */
  const assignOntologyTerm = useCallback(async (termId: string, reviewRequired: boolean = true): Promise<boolean> => {
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
        
        setOntologyTerms([...ontologyTerms, newTerm]);
        
        toast({
          title: "Success",
          description: "Ontology term assigned successfully",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      handleError(
        error,
        "Failed to assign ontology term",
        { 
          level: "warning", 
          technical: false,
          contentId
        }
      );
      
      return false;
    }
  }, [contentId, ontologyTerms, setOntologyTerms]);

  /**
   * Remove an ontology term from the content
   */
  const removeOntologyTerm = useCallback(async (termId: string): Promise<boolean> => {
    if (!contentId || !termId) return false;
    
    try {
      const { error } = await supabase
        .from('knowledge_source_ontology_terms')
        .delete()
        .eq('knowledge_source_id', contentId)
        .eq('ontology_term_id', termId);
      
      if (error) throw error;
      
      // Update local state
      setOntologyTerms(ontologyTerms.filter(term => term.id !== termId));
      
      toast({
        title: "Success",
        description: "Ontology term removed successfully",
      });
      
      return true;
    } catch (error) {
      handleError(
        error,
        "Failed to remove ontology term",
        { 
          level: "warning", 
          technical: false,
          contentId
        }
      );
      
      return false;
    }
  }, [contentId, ontologyTerms, setOntologyTerms]);

  return {
    assignOntologyTerm,
    removeOntologyTerm
  };
}
