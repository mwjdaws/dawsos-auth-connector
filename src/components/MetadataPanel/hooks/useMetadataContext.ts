
/**
 * MetadataContext Hook
 * 
 * Provides a React context for accessing metadata state and operations
 * across components without prop drilling.
 */

import { createContext, useContext } from 'react';
import { ValidationResult } from '@/utils/validation/types';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '../types';

/**
 * Metadata context properties interface
 */
interface MetadataContextProps {
  // Content information
  contentId?: string;
  title?: string;
  description?: string;
  contentType?: string;
  sourceUrl?: string;
  
  // Validation state
  validationResult: ValidationResult;
  isEditable: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Content metadata
  tags?: Tag[];
  ontologyTerms?: OntologyTerm[];
  
  // Handlers for content metadata
  onTitleChange?: (newTitle: string) => void;
  onDescriptionChange?: (newDescription: string) => void;
  onContentTypeChange?: (newContentType: string) => void;
  onSourceUrlChange?: (newSourceUrl: string) => void;
  
  // Refresh metadata
  refreshMetadata?: () => void;
  handleRefresh?: () => Promise<void>;
  fetchSourceMetadata?: () => Promise<void>;
  fetchTags?: () => Promise<Tag[]>;
  
  // Tag operations
  addTag?: (tag: string) => void;
  removeTag?: (tagId: string) => void;
  refreshTags?: () => Promise<void>;
  handleAddTag?: (tag: string, typeId?: string | null) => Promise<void>;
  handleDeleteTag?: (tagId: string) => Promise<void>;
  deleteTag?: (params: { tagId: string, contentId: string }) => Promise<boolean>;
}

/**
 * Create React context
 */
const MetadataContext = createContext<MetadataContextProps | undefined>(undefined);

/**
 * MetadataContext provider
 */
export const MetadataProvider = MetadataContext.Provider;

/**
 * Hook for accessing metadata context
 * 
 * @param contentId Optional content ID to verify context is for the correct content
 * @returns Metadata context object
 * @throws Error if used outside of a MetadataProvider
 */
export function useMetadataContext(contentId?: string) {
  const context = useContext(MetadataContext);
  
  if (!context) {
    throw new Error('useMetadataContext must be used within a MetadataProvider');
  }
  
  // If contentId is provided, verify that context is for the correct content
  if (contentId && context.contentId && contentId !== context.contentId) {
    console.warn(`useMetadataContext: requested contentId ${contentId} doesn't match context contentId ${context.contentId}`);
  }
  
  return context;
}
