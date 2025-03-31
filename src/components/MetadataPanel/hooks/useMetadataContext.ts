
/**
 * MetadataContext Hook
 * 
 * This hook provides access to metadata context outside of the MetadataPanel components.
 * It's useful for accessing metadata operations from any component in the application.
 */
import { createContext, useContext, useRef, useState } from 'react';
import { useMetadataPanel } from './useMetadataPanel';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '../types';
import { isValidContentId, validateContentId } from '@/utils/content-validation';

// Define the metadata context shape
export interface MetadataContextType {
  contentId?: string;
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  isLoading: boolean;
  error: Error | null;
  isValidContent: boolean;
  handleAddTag: (typeId?: string | null) => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleRefresh: () => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
}

// Create context with default values
const MetadataContext = createContext<MetadataContextType>({
  tags: [],
  ontologyTerms: [],
  isLoading: false,
  error: null,
  isValidContent: false,
  handleAddTag: async () => {},
  handleDeleteTag: async () => {},
  handleRefresh: async () => {},
  isAddingTag: false,
  isDeletingTag: false
});

/**
 * Provider component for the metadata context
 */
export function MetadataContextProvider({
  contentId,
  children
}: {
  contentId?: string;
  children: React.ReactNode;
}) {
  // Use the metadata panel hook
  const metadata = useMetadataPanel({ contentId });
  
  // Return the context provider
  return (
    <MetadataContext.Provider value={{
      contentId,
      tags: metadata.tags || [],
      ontologyTerms: metadata.ontologyTerms || [],
      isLoading: metadata.isLoading,
      error: metadata.error,
      isValidContent: metadata.isValidContent,
      handleAddTag: metadata.handleAddTag,
      handleDeleteTag: metadata.handleDeleteTag,
      handleRefresh: metadata.handleRefresh,
      isAddingTag: metadata.isAddingTag,
      isDeletingTag: metadata.isDeletingTag
    }}>
      {children}
    </MetadataContext.Provider>
  );
}

/**
 * Custom hook for accessing the metadata context
 */
export function useMetadataContext(contentId?: string) {
  // Get the context
  const context = useContext(MetadataContext);
  
  // If contentId is provided, we also provide a local instance of the metadata panel hook
  if (contentId) {
    return useMetadataPanel({ contentId });
  }
  
  // Otherwise, return the context
  return context;
}

// Re-export the context and provider
export { MetadataContext, MetadataContextProvider as Provider };

// Default export
export default useMetadataContext;
