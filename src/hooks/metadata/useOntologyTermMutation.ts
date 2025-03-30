
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/utils/query-keys';
import { toast } from '@/hooks/use-toast';
import { OntologyTerm } from '@/utils/api-utils';

/**
 * Hook for adding an ontology term to a knowledge source
 */
export function useAddOntologyTermMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      sourceId, 
      termId, 
      reviewRequired = false 
    }: { 
      sourceId: string; 
      termId: string; 
      reviewRequired?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .insert({
          knowledge_source_id: sourceId,
          ontology_term_id: termId,
          review_required: reviewRequired
        })
        .select(`
          id,
          ontology_term_id,
          review_required,
          ontology_terms:ontology_term_id (
            id,
            term,
            description,
            domain
          )
        `);
      
      if (error) {
        // Check if it's a unique constraint violation
        if (error.code === '23505') {
          throw new Error('This term is already associated with this content.');
        }
        throw error;
      }
      
      return data?.[0];
    },
    
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.ontologyTerms.byContentId(variables.sourceId) 
      });
      
      toast({
        title: "Term Added",
        description: "Ontology term has been added successfully.",
      });
    },
    
    onError: (error: Error) => {
      toast({
        title: "Error Adding Term",
        description: error.message || "Failed to add ontology term",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for removing an ontology term from a knowledge source
 */
export function useRemoveOntologyTermMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      associationId, 
      sourceId 
    }: { 
      associationId: string; 
      sourceId: string;
    }) => {
      const { error } = await supabase
        .from('knowledge_source_ontology_terms')
        .delete()
        .eq('id', associationId);
      
      if (error) throw error;
      
      return { id: associationId };
    },
    
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.ontologyTerms.byContentId(variables.sourceId) 
      });
      
      toast({
        title: "Term Removed",
        description: "Ontology term has been removed successfully.",
      });
    },
    
    onError: (error: Error) => {
      toast({
        title: "Error Removing Term",
        description: error.message || "Failed to remove ontology term",
        variant: "destructive",
      });
    },
  });
}

/**
 * Combined hook that provides both add and remove mutations
 */
export function useOntologyTermMutations() {
  const addTermMutation = useAddOntologyTermMutation();
  const removeTermMutation = useRemoveOntologyTermMutation();
  
  return {
    addTerm: addTermMutation.mutate,
    removeTerm: removeTermMutation.mutate,
    isAddingTerm: addTermMutation.isPending,
    isRemovingTerm: removeTermMutation.isPending,
    addTermError: addTermMutation.error,
    removeTermError: removeTermMutation.error,
  };
}
