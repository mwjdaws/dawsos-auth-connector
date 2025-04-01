
import React, { ReactNode } from 'react';
import { MetadataProvider } from '../../useMetadataContext';
import { ValidationResult } from '@/utils/validation/types';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';

interface MockMetadataProviderProps {
  children: ReactNode;
  contentId?: string;
  tags?: Tag[];
  validationResult?: ValidationResult;
  isEditable?: boolean;
  isLoading?: boolean;
  error?: Error | null;
  ontologyTerms?: OntologyTerm[];
}

/**
 * Mock provider for testing components that consume MetadataContext
 */
export const MockMetadataProvider: React.FC<MockMetadataProviderProps> = ({
  children,
  contentId = 'test-content-123',
  tags = [],
  validationResult = { isValid: true, errorMessage: null, message: 'Valid content', resultType: 'contentId', contentExists: true },
  isEditable = true,
  isLoading = false,
  error = null,
  ontologyTerms = []
}) => {
  // Create context value with provided or default values
  const contextValue = {
    contentId,
    tags,
    validationResult,
    isEditable,
    isLoading,
    error,
    ontologyTerms
  };

  return (
    <MetadataProvider value={contextValue}>
      {children}
    </MetadataProvider>
  );
};

export default MockMetadataProvider;
