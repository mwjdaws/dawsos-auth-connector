
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

/**
 * Fetch ontology terms associated with a content item
 */
export function useOntologyTermsQuery(contentId: string) {
  const [error, setError] = useState<Error | null>(null);

  // Reset error when content ID changes
  useEffect(() => {
    setError(null);
  }, [contentId]);

  return useQuery({
    queryKey: ['ontologyTerms', contentId],
    queryFn: async () => {
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      try {
        // Replace with the knowledge_source_ontology_terms table which exists in the schema
        const { data, error } = await supabase
          .from('knowledge_source_ontology_terms')
          .select(`
            id,
            knowledge_source_id,
            ontology_term_id,
            ontology_terms:ontology_term_id (
              id,
              term:term,
              description,
              domain
            )
          `)
          .eq('knowledge_source_id', contentId);

        if (error) throw error;

        return data.map(item => ({
          id: item.id,
          contentId: item.knowledge_source_id,
          termId: item.ontology_term_id,
          term: {
            id: item.ontology_terms.id,
            name: item.ontology_terms.term,
            description: item.ontology_terms.description,
            domainId: null,
            domainName: item.ontology_terms.domain
          }
        }));
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch ontology terms');
        setError(error);
        handleError(error, 'Failed to fetch ontology terms');
        throw error;
      }
    },
    enabled: isValidContentId(contentId),
    staleTime: 30000 // 30 seconds
  });
}
