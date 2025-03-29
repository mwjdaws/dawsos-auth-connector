
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RelatedTerm } from './types';

/**
 * Hook for fetching related ontology terms based on existing source terms
 */
export function useRelatedTerms(sourceId?: string) {
  return useQuery({
    queryKey: ['ontologyTerms', 'related', sourceId],
    queryFn: async () => {
      if (!sourceId) return [];
      
      const { data, error } = await supabase
        .rpc('get_related_ontology_terms', { knowledge_source_id: sourceId });
        
      if (error) {
        console.error('Error fetching related ontology terms:', error);
        throw error;
      }
      
      return data as RelatedTerm[] || [];
    },
    enabled: !!sourceId
  });
}
