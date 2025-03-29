
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for managing ontology term mutations (add/remove)
 */
export function useTermMutations(sourceId?: string) {
  const queryClient = useQueryClient();

  // Add an ontology term to a knowledge source
  const addTermMutation = useMutation({
    mutationFn: async (termId: string) => {
      if (!sourceId) throw new Error('No source ID provided');
      
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .insert({
          knowledge_source_id: sourceId,
          ontology_term_id: termId,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          review_required: false // User-added terms don't need review
        })
        .select();
        
      if (error) {
        // Ignore unique constraint violations
        if (error.code !== '23505') { 
          console.error('Error adding ontology term:', error);
          throw error;
        } else {
          console.log('Term already associated with this source');
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ontologyTerms', 'source', sourceId] });
      queryClient.invalidateQueries({ queryKey: ['ontologyTerms', 'related', sourceId] });
      toast({
        title: 'Term added',
        description: 'Ontology term has been added to this source',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding term',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Remove an ontology term from a knowledge source
  const removeTermMutation = useMutation({
    mutationFn: async (associationId: string) => {
      const { error } = await supabase
        .from('knowledge_source_ontology_terms')
        .delete()
        .eq('id', associationId);
        
      if (error) {
        console.error('Error removing ontology term:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ontologyTerms', 'source', sourceId] });
      queryClient.invalidateQueries({ queryKey: ['ontologyTerms', 'related', sourceId] });
      toast({
        title: 'Term removed',
        description: 'Ontology term has been removed from this source',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error removing term',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Add a term by name, creating it if it doesn't exist
  const addTermByName = useCallback(async (termName: string, domain?: string) => {
    if (!sourceId || !termName.trim()) return;
    
    try {
      // First check if the term already exists
      const { data: existingTerms } = await supabase
        .from('ontology_terms')
        .select('id, term')
        .ilike('term', termName.trim());
      
      let termId;
      
      if (existingTerms && existingTerms.length > 0) {
        // Use existing term if found
        termId = existingTerms[0].id;
      } else {
        // Create a new term if not found
        const { data, error } = await supabase
          .from('ontology_terms')
          .insert({
            term: termName.trim(),
            domain: domain || null
          })
          .select('id');
          
        if (error) {
          console.error('Error creating new ontology term:', error);
          throw error;
        }
        
        termId = data?.[0]?.id;
      }
      
      if (termId) {
        // Add the term to the knowledge source
        await addTermMutation.mutateAsync(termId);
      }
    } catch (error) {
      console.error('Error in addTermByName:', error);
      toast({
        title: 'Error adding term',
        description: 'Failed to add the ontology term',
        variant: 'destructive'
      });
    }
  }, [sourceId, addTermMutation]);

  return {
    addTerm: (termId: string) => addTermMutation.mutate(termId),
    removeTerm: (associationId: string) => removeTermMutation.mutate(associationId),
    addTermByName,
    isAdding: addTermMutation.isPending,
    isRemoving: removeTermMutation.isPending
  };
}
