
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleError, ErrorLevel } from '@/utils/errors';

interface UseOntologyEnrichmentProps {
  sourceId?: string;
}

/**
 * Hook for enriching content with ontology terms
 */
export function useOntologyEnrichment({ sourceId }: UseOntologyEnrichmentProps = {}) {
  const [isEnriching, setIsEnriching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Enriches content with ontology terms by calling the enrichment edge function
   */
  const enrichContentWithOntology = useCallback(
    async (
      contentId: string,
      content: string,
      title: string,
      options?: { autoTagging?: boolean }
    ) => {
      if (!contentId) {
        setError(new Error('Cannot enrich content: No content ID provided'));
        return null;
      }

      setIsEnriching(true);
      setError(null);

      try {
        // Call the enrichment edge function
        const { data, error } = await supabase.functions.invoke('enrich-content', {
          body: {
            contentId,
            content,
            title,
            autoTagging: options?.autoTagging ?? false
          }
        });

        if (error) {
          throw new Error(`Enrichment error: ${error.message}`);
        }

        return data;
      } catch (err) {
        handleError(
          err,
          `Failed to enrich content with ontology terms: ${contentId}`,
          { level: ErrorLevel.WARNING }
        );
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setIsEnriching(false);
      }
    },
    [sourceId]
  );

  return {
    enrichContentWithOntology,
    isEnriching,
    error
  };
}

export default useOntologyEnrichment;
