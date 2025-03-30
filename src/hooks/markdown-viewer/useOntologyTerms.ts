
/**
 * Hook for managing ontology terms
 */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OntologyTerm } from '@/hooks/markdown-editor/types/ontology';

export interface UseOntologyTermsProps {
  sourceId: string;
}

export interface UseOntologyTermsResult {
  terms: OntologyTerm[];
  isLoading: boolean;
  error: Error | null;
  refreshTerms: () => Promise<void>;
}

export function useOntologyTerms({ sourceId }: UseOntologyTermsProps): UseOntologyTermsResult {
  const [terms, setTerms] = useState<OntologyTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTerms = async () => {
    if (!sourceId) {
      setTerms([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch terms connected to this source
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .select(`
          ontology_term_id,
          ontology_terms:ontology_term_id(
            id,
            term,
            description,
            domain
          )
        `)
        .eq('knowledge_source_id', sourceId);

      if (error) throw new Error(error.message);

      // Transform the data structure
      const transformedTerms: OntologyTerm[] = data
        .map(item => {
          const term = item.ontology_terms;
          if (!term) return null;
          
          return {
            id: term.id,
            term: term.term,
            description: term.description || '',
            domain: term.domain || ''
          };
        })
        .filter(Boolean) as OntologyTerm[];

      setTerms(transformedTerms);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching ontology terms:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, [sourceId]);

  return {
    terms,
    isLoading,
    error,
    refreshTerms: fetchTerms
  };
}

export default useOntologyTerms;
