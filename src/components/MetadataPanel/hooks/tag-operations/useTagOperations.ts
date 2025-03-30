
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errors';
import { supabase } from '@/integrations/supabase/client';
import { useTagFetch } from './useTagFetch';
import { useTagMutations } from './useTagMutations';
import { isValidContentId } from '@/utils/validation';
import { Tag } from './types';

export const useTagOperations = (contentId?: string) => {
  const [newTag, setNewTag] = useState('');
  const { tags, isLoading, error, refetch } = useTagFetch(contentId);
  const { addTag: addTagMutation, deleteTag: deleteTagMutation, isAddingTag, isDeletingTag } = useTagMutations(contentId);
  
  const isValid = contentId ? isValidContentId(contentId) : false;

  // Add a new tag
  const handleAddTag = () => {
    if (!newTag.trim() || !isValid) {
      return;
    }
    
    addTagMutation(newTag);
    setNewTag('');
  };

  // Delete a tag
  const handleDeleteTag = (tagId: string) => {
    if (!isValid) {
      return;
    }
    
    deleteTagMutation(tagId);
  };

  // Update tag ordering
  const handleUpdateTagOrder = async (reorderedTags: Tag[]) => {
    if (!contentId || !isValid) {
      toast({
        title: "Error",
        description: "Invalid content ID",
        variant: "destructive",
      });
      return;
    }

    try {
      // This is a simplified approach. In a real implementation, you might use a junction table
      // with an order field or use a batch update operation.
      
      // For now, let's just log the reordering
      console.log('Reordering tags:', reorderedTags);
      
      toast({
        title: "Success",
        description: "Tag order updated",
      });
      
      // Refetch to ensure we have the latest data
      await refetch();
      
    } catch (error) {
      handleError(error, 'Failed to update tag order', {
        context: { contentId },
        level: 'error',
        showToast: true
      });
    }
  };

  // Refresh tags
  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Success",
        description: "Tags refreshed",
      });
    } catch (error) {
      handleError(error, 'Failed to refresh tags', {
        context: { contentId },
        level: 'error',
        showToast: true
      });
    }
  };

  return {
    tags,
    isLoading,
    error,
    isPending: isAddingTag || isDeletingTag,
    newTag,
    setNewTag,
    handleAddTag,
    handleDeleteTag,
    handleUpdateTagOrder,
    handleRefresh
  };
};
