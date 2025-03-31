
import React, { createContext, useContext, useEffect } from 'react';
import { Tag } from '@/types/tag';
import { ValidationResult } from '@/utils/validation/types';

/**
 * Metadata Context interface
 */
export interface MetadataContextProps {
  contentId: string;
  tags: Tag[];
  isEditable: boolean;
  isLoading: boolean;
  error: Error | null;
  validationResult: ValidationResult;
}

/**
 * Create context with a meaningful error message for when it's used outside of provider
 */
const MetadataContext = createContext<MetadataContextProps | undefined>(undefined);

/**
 * MetadataProvider component
 * 
 * Provides metadata context to its children
 */
export const MetadataProvider: React.FC<{ value: MetadataContextProps; children: React.ReactNode }> = ({
  value,
  children
}) => {
  return (
    <MetadataContext.Provider value={value}>
      {children}
    </MetadataContext.Provider>
  );
};

/**
 * useMetadataContext hook
 * 
 * Provides access to the metadata context
 * @param providedContentId Optional content ID to verify against the context
 * @returns Metadata context values
 */
export function useMetadataContext(providedContentId?: string): MetadataContextProps {
  const context = useContext(MetadataContext);
  
  // Throw a helpful error if the hook is used outside of a provider
  if (context === undefined) {
    throw new Error('useMetadataContext must be used within a MetadataProvider');
  }
  
  // Optional validation to ensure the component using the context is working with the expected content
  useEffect(() => {
    if (providedContentId && providedContentId !== context.contentId) {
      console.warn(
        `Content ID mismatch: Component is using content ID "${providedContentId}" but the MetadataProvider has "${context.contentId}"`
      );
    }
  }, [providedContentId, context.contentId]);
  
  return context;
}

export default useMetadataContext;
