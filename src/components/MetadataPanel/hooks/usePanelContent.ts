
import { useMemo } from 'react';
import { SourceMetadata, OntologyTerm, Tag } from '../types';

interface PanelContentProps {
  contentId: string;
  isLoading: boolean;
  error: any;
  data: SourceMetadata | null;
  validationResult: {
    contentExists?: boolean;
    isValid?: boolean;
  };
  tags?: Tag[];
  ontologyTerms?: OntologyTerm[];
}

export const usePanelContent = (props: PanelContentProps) => {
  const { contentId, isLoading, error, data, validationResult, tags = [], ontologyTerms = [] } = props;

  // Derive panel content based on the loading state, errors, and validation results
  return useMemo(() => {
    const contentExists = validationResult?.contentExists ?? false;
    const isValidContent = validationResult?.isValid ?? false;
    
    // Return the derived state
    return {
      // Content metadata
      contentExists,
      isValidContent,
      contentValidationResult: isValidContent ? 'valid' : 'invalid',
      metadata: data || null,
      
      // Tags and ontology terms
      tags,
      ontologyTerms,
      
      // Loading and error states
      isLoading,
      error,
      
      // Helper function to refresh data
      handleRefresh: () => {
        // This is just a placeholder; the actual implementation would depend on the context
        console.log('Refresh requested for content:', contentId);
      }
    };
  }, [contentId, isLoading, error, data, validationResult, tags, ontologyTerms]);
};
