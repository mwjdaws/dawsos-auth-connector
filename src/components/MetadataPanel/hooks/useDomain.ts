
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OntologyDomain } from '@/types/ontology';
import { handleErrorWithOptions } from '@/utils/errors/handleErrorWithOptions';
import { ErrorLevel, ErrorSource } from '@/utils/errors/types';

/**
 * Hook for fetching and managing ontology domains
 */
export const useDomain = () => {
  const [domains, setDomains] = useState<OntologyDomain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all available domains
  useEffect(() => {
    const fetchDomains = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // NOTE: We're using "ontology_terms" as a workaround since "ontology_domains" table
        // doesn't exist in the current schema. In a real implementation, we'd fetch domains
        // from the proper table or view.
        const { data, error: fetchError } = await supabase
          .from('ontology_terms')
          .select('id, term, description, domain')
          .order('term')
          .is('domain', null)
          .not();
        
        if (fetchError) throw fetchError;
        
        // Transform the data into domains
        const domainsMap = new Map<string, OntologyDomain>();
        
        data.forEach(item => {
          if (item.domain) {
            if (!domainsMap.has(item.domain)) {
              domainsMap.set(item.domain, {
                id: item.id,
                name: item.domain,
                description: `Domain for ${item.domain} terms`
              });
            }
          }
        });
        
        // Convert map to array
        const formattedDomains: OntologyDomain[] = Array.from(domainsMap.values());
        
        setDomains(formattedDomains);
      } catch (err) {
        handleErrorWithOptions(err, "Failed to fetch ontology domains", {
          level: ErrorLevel.Warning,
          source: ErrorSource.Hook
        });
        
        setError(err instanceof Error ? err : new Error('Failed to fetch ontology domains'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDomains();
  }, []);

  return {
    domains,
    isLoading,
    error
  };
};

export default useDomain;
