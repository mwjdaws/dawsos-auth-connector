
import React, { createContext, useContext } from 'react';
import { Tag } from '@/types/tag';
import { OntologyTerm, SourceMetadata } from '../types';
import { ValidationResult } from '@/utils/validation/types';

// Define the context interface
export interface MetadataContextProps {
  contentId: string;
  tags: Tag[];
  validationResult: ValidationResult;
  isEditable: boolean;
  isLoading: boolean;
  error: Error | null;
  ontologyTerms?: OntologyTerm[];
  sourceMetadata?: SourceMetadata | null;
  refreshMetadata?: () => Promise<void>;
  fetchTags?: () => Promise<Tag[]>;
  handleAddTag?: (tagName: string, typeId?: string | null) => Promise<void>;
  handleDeleteTag?: (tagId: string) => Promise<void>;
}

// Create the context with undefined as default value
const MetadataContext = createContext<MetadataContextProps | undefined>(undefined);

// Provider component
export interface MetadataProviderProps {
  value: MetadataContextProps;
  children: React.ReactNode;
}

export const MetadataProvider: React.FC<MetadataProviderProps> = ({ 
  value, 
  children 
}) => {
  return (
    <MetadataContext.Provider value={value}>
      {children}
    </MetadataContext.Provider>
  );
};

// Hook for using the metadata context
export const useMetadataContext = (requestedContentId?: string) => {
  const context = useContext(MetadataContext);
  
  if (!context) {
    throw new Error('useMetadataContext must be used within a MetadataProvider');
  }
  
  // Warn if contentId doesn't match requested contentId (helps catch bugs)
  if (requestedContentId && requestedContentId !== context.contentId) {
    console.warn(
      `Metadata context mismatch: Requested contentId "${requestedContentId}" ` +
      `doesn't match context contentId "${context.contentId}"`
    );
  }
  
  return context;
};
