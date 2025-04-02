
import React, { createContext, useContext } from 'react';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';
import { ValidationResult } from '@/utils/validation/types';

export interface MetadataContextValue {
  contentId: string;
  tags: Tag[];
  ontologyTerms?: OntologyTerm[];
  externalSource?: {
    external_source_url: string | null;
    needs_external_review: boolean;
    external_source_checked_at: string | null;
  } | null;
  domain?: string | null;
  isEditable: boolean;
  isLoading: boolean;
  error: Error | null;
  validationResult?: ValidationResult;
  refetchAll?: () => void;
}

const MetadataContext = createContext<MetadataContextValue | undefined>(undefined);

export const MetadataProvider: React.FC<{
  value: MetadataContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <MetadataContext.Provider value={value}>
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadataContext = (contentIdCheck?: string) => {
  const context = useContext(MetadataContext);
  
  if (!context) {
    throw new Error('useMetadataContext must be used within a MetadataProvider');
  }
  
  // Optional check to ensure the contentId matches what's expected
  if (contentIdCheck && contentIdCheck !== context.contentId) {
    console.warn(
      `Content ID mismatch in useMetadataContext. Expected: ${contentIdCheck}, Got: ${context.contentId}`
    );
  }
  
  return context;
};
