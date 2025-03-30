
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OntologyTerm, RelatedTerm, UseOntologyTermsProps, UseOntologyTermsResult } from '@/hooks/markdown-editor/ontology-terms/types';
import { handleError } from '@/utils/errors';

export function useOntologyTerms({ contentId, includeRelated = false }: UseOntologyTermsProps): UseOntologyTermsResult {
  const [terms, setTerms] = useState<OntologyTerm[]>([]);
  const [relatedTerms, setRelatedTerms] = useState<RelatedTerm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTerms = useCallback(async () => {
    if (!contentId) {
      setTerms([]);
      setRelatedTerms([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch terms associated with the content
      const { data: associationData, error: associationError } = await supabase
        .from('knowledge_source_ontology_terms')
        .select(`
          id,
          review_required,
          ontology_term_id,
          ontology_terms:ontology_term_id (
            id,
            term,
            description,
            domain
          )
        `)
        .eq('knowledge_source_id', contentId);

      if (associationError) {
        throw associationError;
      }

      const formattedTerms: OntologyTerm[] = associationData
        .filter(item => item.ontology_terms) // Filter out any null values
        .map(item => ({
          id: item.ontology_terms?.id || '',
          term: item.ontology_terms?.term || '',
          description: item.ontology_terms?.description || '',
          domain: item.ontology_terms?.domain || '',
          associationId: item.id,
          review_required: item.review_required
        }));

      setTerms(formattedTerms);

      // Fetch related terms if needed
      if (includeRelated) {
        const { data: relatedData, error: relatedError } = await supabase
          .rpc('get_related_ontology_terms', { knowledge_source_id: contentId });

        if (relatedError) {
          throw relatedError;
        }

        setRelatedTerms(relatedData || []);
      }
    } catch (err) {
      console.error('Error fetching ontology terms:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch ontology terms');
      setError(errorObj);
      handleError(errorObj, 'Failed to fetch ontology terms');
    } finally {
      setIsLoading(false);
    }
  }, [contentId, includeRelated]);

  // Alias for fetchTerms to match expected interface
  const handleRefresh = fetchTerms;

  // Fetch terms when contentId changes
  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  return {
    terms,
    relatedTerms,
    isLoading,
    error,
    fetchTerms,
    handleRefresh
  };
}
