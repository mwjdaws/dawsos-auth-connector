
import { useSourceTerms } from './ontology-terms/useSourceTerms';
import { useRelatedTerms } from './ontology-terms/useRelatedTerms';
import { useAllTermsAndDomains } from './ontology-terms/useAllTermsAndDomains';
import { useTermMutations } from './ontology-terms/useTermMutations';
import type { OntologyTerm, RelatedTerm } from './ontology-terms/types';

/**
 * Hook for managing ontology terms for a knowledge source
 */
export function useOntologyTerms(sourceId?: string) {
  const sourceTermsQuery = useSourceTerms(sourceId);
  const relatedTermsQuery = useRelatedTerms(sourceId);
  const { 
    terms: allTerms,
    domains,
    searchTerm,
    setSearchTerm,
    selectedDomain,
    setSelectedDomain,
    isLoadingTerms,
    isLoadingDomains
  } = useAllTermsAndDomains();
  
  const {
    addTerm,
    removeTerm,
    addTermByName,
    isAdding,
    isRemoving
  } = useTermMutations(sourceId);

  return {
    sourceTerms: sourceTermsQuery.data || [],
    relatedTerms: relatedTermsQuery.data || [],
    allTerms,
    domains,
    isLoading: 
      sourceTermsQuery.isLoading || 
      relatedTermsQuery.isLoading || 
      isLoadingTerms || 
      isLoadingDomains,
    isAdding,
    isRemoving,
    searchTerm,
    setSearchTerm,
    selectedDomain,
    setSelectedDomain,
    addTerm,
    removeTerm,
    addTermByName
  };
}
