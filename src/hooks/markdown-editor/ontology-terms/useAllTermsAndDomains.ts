
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OntologyTerm } from './types';

/**
 * Hook for fetching all available ontology terms and domains with filtering
 */
export function useAllTermsAndDomains() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const allTermsQuery = useQuery({
    queryKey: ['ontologyTerms', 'all', searchTerm, selectedDomain],
    queryFn: async () => {
      let query = supabase
        .from('ontology_terms')
        .select('*');
        
      // Apply search filter if provided
      if (searchTerm) {
        query = query.ilike('term', `%${searchTerm}%`);
      }
      
      // Apply domain filter if selected
      if (selectedDomain) {
        query = query.eq('domain', selectedDomain);
      }
      
      // Execute query
      const { data, error } = await query;
        
      if (error) {
        console.error('Error fetching ontology terms:', error);
        throw error;
      }
      
      return data as OntologyTerm[] || [];
    }
  });

  const domainsQuery = useQuery({
    queryKey: ['ontologyTerms', 'domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ontology_terms')
        .select('domain')
        .not('domain', 'is', null)
        .order('domain');
        
      if (error) {
        console.error('Error fetching ontology domains:', error);
        throw error;
      }
      
      // Extract unique domains
      const domains = new Set(data?.map(item => item.domain).filter(Boolean));
      return Array.from(domains) as string[];
    }
  });

  return {
    terms: allTermsQuery.data || [],
    isLoadingTerms: allTermsQuery.isLoading,
    domains: domainsQuery.data || [],
    isLoadingDomains: domainsQuery.isLoading,
    searchTerm,
    setSearchTerm,
    selectedDomain,
    setSelectedDomain
  };
}
