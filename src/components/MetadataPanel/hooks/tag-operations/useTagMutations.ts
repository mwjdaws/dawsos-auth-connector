
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

/**
 * Hook to handle tag mutations (add, delete, reorder)
 */
export const useTagMutations = (contentId: string) => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  // Add tag mutation
  const addTagMutation = useMutation({
    mutationFn: async (newTag: { name: string; type_id?: string }) => {
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      // Get the current highest position
      const { data: existingTags, error: fetchError } = await supabase
        .from('tags')
        .select('position')
        .eq('content_id', contentId)
        .order('position', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      const nextPosition = existingTags.length > 0 ? (existingTags[0].position || 0) + 1 : 0;

      const { data, error } = await supabase
        .from('tags')
        .insert([
          {
            name: newTag.name,
            content_id: contentId,
            type_id: newTag.type_id,
            position: nextPosition,
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    },
    onMutate: () => {
      setIsPending(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
      toast({
        title: 'Tag Added',
        variant: 'default',
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to add tag');
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('content_id', contentId);

      if (error) throw error;
      return tagId;
    },
    onMutate: () => {
      setIsPending(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
      toast({
        title: 'Tag Removed',
        variant: 'default',
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to remove tag');
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  // Update tag order mutation
  const updateTagOrderMutation = useMutation({
    mutationFn: async (tags: { id: string; position: number }[]) => {
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      // Update each tag's position
      const promises = tags.map(({ id, position }) =>
        supabase
          .from('tags')
          .update({ position })
          .eq('id', id)
          .eq('content_id', contentId)
      );

      await Promise.all(promises);
      return tags;
    },
    onMutate: () => {
      setIsPending(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
      toast({
        title: 'Tag Order Updated',
        variant: 'default',
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to update tag order');
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  return {
    addTagMutation,
    deleteTagMutation,
    updateTagOrderMutation,
    isPending,
  };
};
