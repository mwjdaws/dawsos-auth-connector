
/**
 * Hook for mutating ontology terms
 */
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OntologyTerm } from '@/hooks/markdown-editor/types/ontology';
import { useAuth } from '@/hooks/useAuth';

export interface UseTermMutationsProps {
  sourceId: string;
  onSuccess?: () => void;
}

export interface UseTermMutationsResult {
  addTerm: (termId: string) => Promise<boolean>;
  removeTerm: (termId: string) => Promise<boolean>;
  createTerm: (term: string, description: string, domain?: string) => Promise<OntologyTerm | null>;
  isLoading: boolean;
  error: Error | null;
}

export function useTermMutations({ sourceId, onSuccess }: UseTermMutationsProps): UseTermMutationsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const addTerm = async (termId: string): Promise<boolean> => {
    if (!sourceId || !termId) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('knowledge_source_ontology_terms')
        .insert({
          knowledge_source_id: sourceId,
          ontology_term_id: termId,
          created_by: user?.id || null,
          review_required: false
        });
      
      if (error) throw new Error(error.message);
      
      if (onSuccess) onSuccess();
      return true;
    } catch (err: any) {
      console.error('Error adding ontology term:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeTerm = async (termId: string): Promise<boolean> => {
    if (!sourceId || !termId) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('knowledge_source_ontology_terms')
        .delete()
        .eq('knowledge_source_id', sourceId)
        .eq('ontology_term_id', termId);
      
      if (error) throw new Error(error.message);
      
      if (onSuccess) onSuccess();
      return true;
    } catch (err: any) {
      console.error('Error removing ontology term:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createTerm = async (
    term: string,
    description: string,
    domain?: string
  ): Promise<OntologyTerm | null> => {
    if (!term) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // First create the ontology term
      const { data: termData, error: termError } = await supabase
        .from('ontology_terms')
        .insert({
          term,
          description,
          domain: domain || null
        })
        .select()
        .single();
      
      if (termError) throw new Error(termError.message);
      
      if (sourceId) {
        // Then link it to the source
        const { error: linkError } = await supabase
          .from('knowledge_source_ontology_terms')
          .insert({
            knowledge_source_id: sourceId,
            ontology_term_id: termData.id,
            created_by: user?.id || null,
            review_required: false
          });
        
        if (linkError) throw new Error(linkError.message);
      }
      
      if (onSuccess) onSuccess();
      
      // Return the created term
      return {
        id: termData.id,
        term: termData.term,
        description: termData.description || '',
        domain: termData.domain || ''
      };
    } catch (err: any) {
      console.error('Error creating ontology term:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    addTerm,
    removeTerm,
    createTerm,
    isLoading,
    error
  };
}

export default useTermMutations;
