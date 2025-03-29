
import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  associationId?: string; // ID of the association record (for removal)
}

export interface RelatedTerm {
  term_id: string;
  term: string;
  description: string;
  domain: string;
  relation_type: string;
}

/**
 * Hook for managing ontology terms for a knowledge source
 */
export function useOntologyTerms(sourceId?: string) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch ontology terms associated with the knowledge source
  const sourceTermsQuery = useQuery({
    queryKey: ['ontologyTerms', 'source', sourceId],
    queryFn: async () => {
      if (!sourceId) return [];
      
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .select(`
          id,
          ontology_term_id,
          ontology_terms:ontology_term_id (
            id, 
            term,
            description,
            domain
          )
        `)
        .eq('knowledge_source_id', sourceId);
        
      if (error) {
        console.error('Error fetching source ontology terms:', error);
        throw error;
      }
      
      return data?.map(item => ({
        associationId: item.id,
        id: item.ontology_terms.id,
        term: item.ontology_terms.term,
        description: item.ontology_terms.description,
        domain: item.ontology_terms.domain
      })) || [];
    },
    enabled: !!sourceId
  });

  // Fetch related terms based on existing source terms
  const relatedTermsQuery = useQuery({
    queryKey: ['ontologyTerms', 'related', sourceId],
    queryFn: async () => {
      if (!sourceId) return [];
      
      const { data, error } = await supabase
        .rpc('get_related_ontology_terms', { knowledge_source_id: sourceId });
        
      if (error) {
        console.error('Error fetching related ontology terms:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!sourceId
  });

  // Fetch all available ontology terms with search and domain filtering
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
      
      return data || [];
    }
  });

  // Fetch available domains for filtering
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
      return Array.from(domains);
    }
  });

  // Add an ontology term to a knowledge source
  const addTermMutation = useMutation({
    mutationFn: async (termId: string) => {
      if (!sourceId) throw new Error('No source ID provided');
      
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .insert({
          knowledge_source_id: sourceId,
          ontology_term_id: termId,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select();
        
      if (error) {
        // Ignore unique constraint violations
        if (error.code !== '23505') { 
          console.error('Error adding ontology term:', error);
          throw error;
        } else {
          console.log('Term already associated with this source');
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ontologyTerms', 'source', sourceId] });
      queryClient.invalidateQueries({ queryKey: ['ontologyTerms', 'related', sourceId] });
      toast({
        title: 'Term added',
        description: 'Ontology term has been added to this source',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding term',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Remove an ontology term from a knowledge source
  const removeTermMutation = useMutation({
    mutationFn: async (associationId: string) => {
      const { error } = await supabase
        .from('knowledge_source_ontology_terms')
        .delete()
        .eq('id', associationId);
        
      if (error) {
        console.error('Error removing ontology term:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ontologyTerms', 'source', sourceId] });
      queryClient.invalidateQueries({ queryKey: ['ontologyTerms', 'related', sourceId] });
      toast({
        title: 'Term removed',
        description: 'Ontology term has been removed from this source',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error removing term',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Add a term by name, creating it if it doesn't exist
  const addTermByName = useCallback(async (termName: string, domain?: string) => {
    if (!sourceId || !termName.trim()) return;
    
    try {
      // First check if the term already exists
      const { data: existingTerms } = await supabase
        .from('ontology_terms')
        .select('id, term')
        .ilike('term', termName.trim());
      
      let termId;
      
      if (existingTerms && existingTerms.length > 0) {
        // Use existing term if found
        termId = existingTerms[0].id;
      } else {
        // Create a new term if not found
        const { data, error } = await supabase
          .from('ontology_terms')
          .insert({
            term: termName.trim(),
            domain: domain || null
          })
          .select('id');
          
        if (error) {
          console.error('Error creating new ontology term:', error);
          throw error;
        }
        
        termId = data?.[0]?.id;
      }
      
      if (termId) {
        // Add the term to the knowledge source
        await addTermMutation.mutateAsync(termId);
      }
    } catch (error) {
      console.error('Error in addTermByName:', error);
      toast({
        title: 'Error adding term',
        description: 'Failed to add the ontology term',
        variant: 'destructive'
      });
    }
  }, [sourceId, addTermMutation]);

  return {
    sourceTerms: sourceTermsQuery.data || [],
    relatedTerms: relatedTermsQuery.data || [],
    allTerms: allTermsQuery.data || [],
    domains: domainsQuery.data || [],
    isLoading: 
      sourceTermsQuery.isLoading || 
      relatedTermsQuery.isLoading || 
      allTermsQuery.isLoading || 
      domainsQuery.isLoading,
    isAdding: addTermMutation.isPending,
    isRemoving: removeTermMutation.isPending,
    searchTerm,
    setSearchTerm,
    selectedDomain,
    setSelectedDomain,
    addTerm: (termId: string) => addTermMutation.mutate(termId),
    removeTerm: (associationId: string) => removeTermMutation.mutate(associationId),
    addTermByName
  };
}
