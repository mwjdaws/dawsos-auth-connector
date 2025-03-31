
/**
 * useMetadataContext Hook
 * 
 * This hook provides a context for metadata operations and validation, 
 * bringing together content validation and tag operations.
 */
import { createContext, useContext } from 'react';
import { useContentValidator } from '@/hooks/validation/useContentValidator';
import { useTagOperations } from './tag-operations/useTagOperations';

// Default implementation for the context
const defaultContext = {
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
  handleReorderTags: async (_: any[]) => {},
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
