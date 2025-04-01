
import { useState, useEffect, useCallback } from 'react';
import { OntologyTerm } from '@/types/ontology';
import { supabase } from '@/integrations/supabase/client';
import { handleError, ErrorLevel } from '@/utils/errors/handle';

interface UseOntologyTermsProps {
  contentId: string;
}

export const useOntologyTerms = ({ contentId }: UseOntologyTermsProps) => {
  const [terms, setTerms] = useState<OntologyTerm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchTerms = useCallback(async () => {
    if (!contentId) {
      return [];
    }
    
    try {
      setIsLoading(true);
      
      // Query ontology terms linked to this content
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .select(`
          ontology_term_id,
          review_required,
          ontology_terms (
            id,
            term,
            description,
            domain
          )
        `)
        .eq('knowledge_source_id', contentId);
      
      if (error) {
        throw new Error(`Failed to fetch ontology terms: ${error.message}`);
      }
      
      // Transform the response into our OntologyTerm type
      const formattedTerms: OntologyTerm[] = data
        .filter(item => item.ontology_terms)
        .map(item => ({
          id: item.ontology_terms.id,
          term: item.ontology_terms.term || '',
          description: item.ontology_terms.description || '',
          domain: item.ontology_terms.domain || '',
          review_required: !!item.review_required
        }));
      
      setTerms(formattedTerms);
      return formattedTerms;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch ontology terms');
      setError(error);
      handleError(
        error,
        'Error fetching ontology terms',
        { level: ErrorLevel.WARNING }
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [contentId]);
  
  // Handle add term functionality
  const handleAddTerm = async (termId: string) => {
    if (!contentId || !termId) return false;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('knowledge_source_ontology_terms')
        .insert({
          knowledge_source_id: contentId,
          ontology_term_id: termId,
          review_required: false
        });
      
      if (error) throw new Error(`Failed to add term: ${error.message}`);
      
      // Refresh terms list
      await fetchTerms();
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add ontology term');
      setError(error);
      handleError(
        error,
        'Error adding ontology term',
        { level: ErrorLevel.WARNING }
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle remove term functionality
  const handleRemoveTerm = async (termId: string) => {
    if (!contentId || !termId) return false;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('knowledge_source_ontology_terms')
        .delete()
        .eq('knowledge_source_id', contentId)
        .eq('ontology_term_id', termId);
      
      if (error) throw new Error(`Failed to remove term: ${error.message}`);
      
      // Update local state
      setTerms(terms.filter(term => term.id !== termId));
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove ontology term');
      setError(error);
      handleError(
        error,
        'Error removing ontology term',
        { level: ErrorLevel.WARNING }
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (contentId) {
      fetchTerms();
    }
  }, [contentId, fetchTerms]);
  
  return {
    terms,
    isLoading,
    error,
    fetchTerms,
    handleAddTerm,
    handleRemoveTerm
  };
};

export default useOntologyTerms;
