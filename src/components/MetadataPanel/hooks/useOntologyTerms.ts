
import { useState, useEffect, useCallback } from 'react';
import { OntologyTerm } from '../types';
import { supabase } from '@/integrations/supabase/client';

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
        .from('content_ontology_terms')
        .select(`
          ontology_term_id,
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
          domain: item.ontology_terms.domain || ''
        }));
      
      setTerms(formattedTerms);
      return formattedTerms;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch ontology terms');
      setError(error);
      console.error('Error fetching ontology terms:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [contentId]);
  
  useEffect(() => {
    if (contentId) {
      fetchTerms();
    }
  }, [contentId, fetchTerms]);
  
  return {
    terms,
    isLoading,
    error,
    fetchTerms
  };
};
