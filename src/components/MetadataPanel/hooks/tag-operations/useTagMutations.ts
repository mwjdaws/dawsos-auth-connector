
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { queryKeys } from '@/utils/query-keys';
import { isValidContentId } from '@/utils/validation';
import { Tag } from './types';
import { toast } from '@/hooks/use-toast';

export const useTagMutations = (contentId?: string) => {
  const queryClient = useQueryClient();
  const isValid = contentId ? isValidContentId(contentId) : false;

  const { mutate: addTag, isPending: isAddingTag } = useMutation({
    mutationFn: async (tagName: string) => {
      if (!contentId || !isValid) {
        throw new Error('Invalid content ID');
      }

      if (!tagName.trim()) {
        throw new Error('Tag name cannot be empty');
      }

      const { data, error } = await supabase
        .from('tags')
        .insert([
          { content_id: contentId, name: tagName.trim().toLowerCase() }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Tag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.tags.byContentId(contentId!)
      });
      
      toast({
        title: "Success",
        description: "Tag added successfully",
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to add tag', {
        context: { contentId },
        level: 'error',
        showToast: true
      });
    }
  });

  const { mutate: deleteTag, isPending: isDeletingTag } = useMutation({
    mutationFn: async (tagId: string) => {
      if (!contentId || !isValid) {
        throw new Error('Invalid content ID');
      }

      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('content_id', contentId);

      if (error) {
        throw error;
      }

      return tagId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.tags.byContentId(contentId!)
      });
      
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to delete tag', {
        context: { contentId },
        level: 'error',
        showToast: true
      });
    }
  });

  return {
    addTag,
    deleteTag,
    isAddingTag,
    isDeletingTag
  };
};
