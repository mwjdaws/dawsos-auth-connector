
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OntologyDomain } from '@/types/ontology';
import { handleError } from '@/utils/errors';
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
        const { data, error: fetchError } = await supabase
          .from('ontology_domains')
          .select('*')
          .order('name');
        
        if (fetchError) throw fetchError;
        
        // Ensure all required properties are present
        const formattedDomains: OntologyDomain[] = data.map(domain => ({
          id: domain.id,
          name: domain.name || '',
          description: domain.description || ''
        }));
        
        setDomains(formattedDomains);
      } catch (err) {
        handleError(err, {
          message: "Failed to fetch ontology domains",
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
