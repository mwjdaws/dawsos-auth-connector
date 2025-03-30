
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
        const { data, error } = await supabase
          .from('ontology_content_terms')
          .select(`
            id,
            content_id,
            term_id,
            ontology_terms (
              id,
              name,
              description,
              domain_id,
              ontology_domains (name)
            )
          `)
          .eq('content_id', contentId);

        if (error) throw error;

        return data.map(item => ({
          id: item.id,
          contentId: item.content_id,
          termId: item.term_id,
          term: {
            id: item.ontology_terms.id,
            name: item.ontology_terms.name,
            description: item.ontology_terms.description,
            domainId: item.ontology_terms.domain_id,
            domainName: item.ontology_terms.ontology_domains?.name
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
