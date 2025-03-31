
/**
 * useMetadataContext Hook
 * 
 * This hook provides a context for metadata operations and validation, 
 * bringing together content validation and tag operations.
 */
import { createContext, useContext } from 'react';
import { useContentValidator } from '@/hooks/validation/useContentValidator';
import { useTagOperations } from './tag-operations/useTagOperations';
import { Tag } from '@/types/tag';

// Context interface
interface MetadataContextValue {
  contentId: string;
  isValidContent: boolean;
  contentExists: boolean;
  errorMessage: string | null;
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  newTag: string;
  setNewTag: (tag: string) => void;
  handleAddTag: (typeId?: string | null) => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleReorderTags: (tags: Tag[]) => Promise<void>;
  handleRefresh: () => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

// Default implementation for the context
const defaultContext: MetadataContextValue = {
  contentId: '',
  isValidContent: false,
  contentExists: false,
  errorMessage: '',
  tags: [],
  isLoading: false,
  error: null,
  newTag: '',
  setNewTag: (_: string) => {},
  handleAddTag: async (_?: string | null) => {},
  handleDeleteTag: async (_: string) => {},
  handleReorderTags: async (_: Tag[]) => {},
  handleRefresh: async () => {},
  isAddingTag: false,
  isDeletingTag: false,
  isReordering: false
};

// Create the context
const MetadataContext = createContext(defaultContext);

/**
 * Hook for providing metadata context to components
 */
export const useMetadataProvider = (contentId: string) => {
  // Use the content validator for ID validation
  const {
    isValid: isValidContent,
    contentExists,
    errorMessage
  } = useContentValidator(contentId);
  
  // Use tag operations with integrated validation
  const tagOperations = useTagOperations(contentId);
  
  // Combine into a context value
  const contextValue = {
    contentId,
    isValidContent,
    contentExists,
    errorMessage,
    ...tagOperations
  };
  
  return {
    contextValue
  };
};

/**
 * Hook for consuming metadata context
 */
export const useMetadataContext = () => {
  return useContext(MetadataContext);
};

// Export the context provider for use in components
export { MetadataContext };
