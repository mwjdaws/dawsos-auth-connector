
/**
 * useValidatedTagOperations Hook
 * 
 * Wraps tag operations with validation to ensure tag operations 
 * only proceed when validation passes.
 */
import { useTagOperations } from '@/components/MetadataPanel/hooks/tag-operations/useTagOperations';
import { useTagValidation } from './useTagValidation';
import { useContentValidator } from './useContentValidator';
import { Tag } from '@/components/MetadataPanel/hooks/tag-operations/types';
import { handleError } from '@/utils/errors/handle';

interface UseValidatedTagOperationsProps {
  contentId: string;
}

/**
 * Hook for tag operations with integrated validation
 * 
 * @param contentId ID of the content to operate on
 * @returns Validated tag operations
 */
export function useValidatedTagOperations({ contentId }: UseValidatedTagOperationsProps) {
  // Get base tag operations
  const tagOperations = useTagOperations(contentId);
  
  // Get validation utilities
  const { validateTagOperation, validateTag } = useTagValidation();
  const { isValid: isValidContent, contentExists, errorMessage } = useContentValidator(contentId);
  
  /**
   * Add a tag with validation
   */
  const handleAddTag = async (typeId?: string | null) => {
    if (!tagOperations.newTag.trim()) return;
    
    // Validate content ID and tag
    if (!isValidContent) {
      handleError(
        new Error(errorMessage || 'Invalid content ID'),
        errorMessage || 'Cannot add tag: invalid content ID',
        { level: 'warning' }
      );
      return;
    }
    
    // Validate the tag
    const validation = validateTag(tagOperations.newTag);
    if (!validation.isValid) {
      handleError(
        new Error(validation.errorMessage || 'Invalid tag'),
        validation.errorMessage || 'Invalid tag',
        { level: 'warning' }
      );
      return;
    }
    
    // Proceed with adding the tag
    await tagOperations.handleAddTag(typeId);
  };
  
  /**
   * Delete a tag with validation
   */
  const handleDeleteTag = async (tagId: string) => {
    if (!isValidContent) {
      handleError(
        new Error(errorMessage || 'Invalid content ID'),
        errorMessage || 'Cannot delete tag: invalid content ID',
        { level: 'warning' }
      );
      return;
    }
    
    await tagOperations.handleDeleteTag(tagId);
  };
  
  /**
   * Reorder tags with validation
   */
  const handleReorderTags = async (updatedTags: Tag[]) => {
    if (!isValidContent) {
      handleError(
        new Error(errorMessage || 'Invalid content ID'),
        errorMessage || 'Cannot reorder tags: invalid content ID',
        { level: 'warning' }
      );
      return;
    }
    
    await tagOperations.handleReorderTags(updatedTags);
  };
  
  return {
    ...tagOperations,
    isValidContent,
    contentExists,
    handleAddTag,
    handleDeleteTag,
    handleReorderTags,
    validationMessage: errorMessage
  };
}

// Default export
export default useValidatedTagOperations;
