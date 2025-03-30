
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { UseTermMutationsProps, UseTermMutationsResult } from '@/hooks/markdown-editor/ontology-terms/types';
import { handleError } from '@/utils/errors';

export function useTermMutations({ contentId }: UseTermMutationsProps): UseTermMutationsResult {
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Add an existing term to the content
  const addTerm = useCallback(async (termId: string, reviewRequired = false): Promise<boolean> => {
    if (!contentId || !termId) {
      return false;
    }

    setIsAdding(true);
    setError(null);

    try {
      // Check if the association already exists
      const { data: existingData, error: checkError } = await supabase
        .from('knowledge_source_ontology_terms')
        .select('id')
        .eq('knowledge_source_id', contentId)
        .eq('ontology_term_id', termId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "row not found" which is expected
        throw checkError;
      }

      // If the association already exists, just return success
      if (existingData) {
        toast({
          title: 'Term Already Added',
          description: 'This term is already associated with the content.',
        });
        return true;
      }

      // Create the association
      const { error: insertError } = await supabase
        .from('knowledge_source_ontology_terms')
        .insert({
          knowledge_source_id: contentId,
          ontology_term_id: termId,
          created_by: user?.id || null,
          review_required: reviewRequired
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: 'Term Added',
        description: 'The term has been associated with the content.',
      });

      return true;
    } catch (err) {
      console.error('Error adding term:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to add term');
      setError(errorObj);
      handleError(errorObj, 'Failed to add term');
      return false;
    } finally {
      setIsAdding(false);
    }
  }, [contentId, user]);

  // Delete a term association
  const deleteTerm = useCallback(async (associationId: string): Promise<boolean> => {
    if (!associationId) {
      return false;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('knowledge_source_ontology_terms')
        .delete()
        .eq('id', associationId);

      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: 'Term Removed',
        description: 'The term has been removed from the content.',
      });

      return true;
    } catch (err) {
      console.error('Error deleting term:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to delete term');
      setError(errorObj);
      handleError(errorObj, 'Failed to delete term');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Create a new term and add it to the content
  const createAndAddTerm = useCallback(async (term: string, description?: string, domain?: string): Promise<string | null> => {
    if (!contentId || !term.trim()) {
      return null;
    }

    setIsAdding(true);
    setError(null);

    try {
      // Check if term already exists
      const { data: existingTerms, error: checkError } = await supabase
        .from('ontology_terms')
        .select('id')
        .ilike('term', term.trim());

      if (checkError) {
        throw checkError;
      }

      let termId;

      if (existingTerms && existingTerms.length > 0) {
        // Use existing term
        termId = existingTerms[0].id;
        
        toast({
          title: 'Using Existing Term',
          description: 'This term already exists in the ontology.',
        });
      } else {
        // Create new term
        const { data: newTerm, error: createError } = await supabase
          .from('ontology_terms')
          .insert({
            term: term.trim(),
            description: description || null,
            domain: domain || null
          })
          .select('id')
          .single();

        if (createError) {
          throw createError;
        }

        termId = newTerm.id;
        
        toast({
          title: 'New Term Created',
          description: 'A new term has been added to the ontology.',
        });
      }

      // Add term to content
      const success = await addTerm(termId, true);

      if (success) {
        return termId;
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error creating and adding term:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to create and add term');
      setError(errorObj);
      handleError(errorObj, 'Failed to create and add term');
      return null;
    } finally {
      setIsAdding(false);
    }
  }, [contentId, addTerm]);

  return {
    addTerm,
    deleteTerm,
    createAndAddTerm,
    isAdding,
    isDeleting,
    error
  };
}
