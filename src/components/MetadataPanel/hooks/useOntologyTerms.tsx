
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OntologyTerm } from '@/types';
import { handleError, ErrorLevel } from '@/utils/errors';

interface UseOntologyTermsProps {
  contentId: string;
  enabled?: boolean;
}

export const useOntologyTerms = ({ 
  contentId, 
  enabled = true 
}: UseOntologyTermsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [terms, setTerms] = useState<OntologyTerm[]>([]);
  
  /**
   * Fetch ontology terms associated with the content
   */
  const fetchOntologyTerms = useCallback(async () => {
    if (!contentId || !enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
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
      
      if (error) throw error;
      
      // Transform data into OntologyTerm[] format
      const transformedTerms: OntologyTerm[] = data
        .filter(item => item.ontology_terms) // Ensure ontology_terms exists
        .map(item => ({
          id: item.ontology_terms.id,
          term: item.ontology_terms.term,
          description: item.ontology_terms.description || '', // Ensure non-null
          domain: item.ontology_terms.domain || '', // Ensure non-null
          review_required: item.review_required
        }));
      
      setTerms(transformedTerms);
    } catch (err) {
      console.error('Error fetching ontology terms:', err);
      
      setError(new Error('Failed to fetch ontology terms'));
      
      handleError(
        err,
        'Failed to load ontology terms',
        { level: ErrorLevel.WARNING, context: { contentId } }
      );
    } finally {
      setIsLoading(false);
    }
  }, [contentId, enabled]);
  
  // Fetch terms on mount and when contentId changes
  useEffect(() => {
    if (contentId && enabled) {
      fetchOntologyTerms();
    }
  }, [contentId, enabled, fetchOntologyTerms]);
  
  return {
    terms,
    isLoading,
    error,
    fetchOntologyTerms,
    setTerms
  };
};
