
/**
 * Hook for tag operations with integrated validation
 * 
 * This hook wraps tag operations with validation checks to ensure
 * all operations follow validation rules consistently.
 */
import { useState, useCallback } from 'react';
import { useTagValidation } from './useTagValidation';
import { useContentIdValidation } from './useContentIdValidation';
import { toast } from 'sonner';
import { Tag } from '@/types/tag';
import { handleError } from '@/utils/errors';

interface ValidatedTagOperationsProps {
  contentId?: string | null;
  tags?: Tag[];
  onAddTag?: (tagName: string, typeId?: string | null) => Promise<void>;
  onDeleteTag?: (tagId: string) => Promise<void>;
  onMetadataChange?: () => void;
}

export function useValidatedTagOperations({
  contentId,
  tags = [],
  onAddTag,
  onDeleteTag,
  onMetadataChange
}: ValidatedTagOperationsProps) {
  // Get content validation info
  const { isValid: isValidContent, isTemporary } = useContentIdValidation(contentId);
  
  // Get tag validation utilities
  const { validateTag, isDuplicateTag } = useTagValidation(contentId, { existingTags: tags });
  
  // Local state for tag input
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);

  // Validated add tag handler
  const handleAddTag = useCallback(async (typeId?: string | null) => {
    // Validate content ID
    if (!isValidContent) {
      toast.error('Cannot add tags: Invalid content ID');
      return;
    }
    
    // Validate tag name
    const trimmedTag = newTag.trim();
    const validation = validateTag(trimmedTag, { checkDuplicates: true });
    
    if (!validation.isValid) {
      toast.error(validation.errorMessage || 'Invalid tag');
      return;
    }
    
    // Proceed with adding tag
    try {
      setIsAddingTag(true);
      if (onAddTag) {
        await onAddTag(trimmedTag, typeId);
        setNewTag(''); // Clear input on success
        
        // Call metadata change callback if provided
        if (onMetadataChange) {
          onMetadataChange();
        }
        
        toast.success(`Tag "${trimmedTag}" added successfully`);
      }
    } catch (error) {
      handleError(
        error,
        "Failed to add tag",
        { level: "warning", technical: false, context: { contentId } }
      );
    } finally {
      setIsAddingTag(false);
    }
  }, [newTag, isValidContent, onAddTag, onMetadataChange, validateTag]);

  // Validated delete tag handler
  const handleDeleteTag = useCallback(async (tagId: string) => {
    // Validate content ID
    if (!isValidContent) {
      toast.error('Cannot delete tag: Invalid content ID');
      return;
    }
    
    try {
      setIsDeletingTag(true);
      if (onDeleteTag) {
        await onDeleteTag(tagId);
        
        // Call metadata change callback if provided
        if (onMetadataChange) {
          onMetadataChange();
        }
        
        toast.success('Tag deleted successfully');
      }
    } catch (error) {
      handleError(
        error,
        "Failed to delete tag",
        { level: "warning", technical: false, context: { contentId } }
      );
    } finally {
      setIsDeletingTag(false);
    }
  }, [isValidContent, onDeleteTag, onMetadataChange]);

  return {
    newTag,
    setNewTag,
    isAddingTag,
    isDeletingTag,
    handleAddTag,
    handleDeleteTag,
    isValidContent,
    isTemporaryContent: isTemporary,
    validateTag
  };
}

export default useValidatedTagOperations;
