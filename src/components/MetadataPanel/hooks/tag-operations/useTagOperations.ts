
import { useEffect } from "react";
import { TagOperationsProps } from "./types";
import { useTagState } from "./useTagState";
import { useTagFetch } from "./useTagFetch";
import { useTagMutations } from "./useTagMutations";
import { isValidContentId } from '@/utils/validation';

/**
 * A composable hook that combines tag state management, fetching, and mutations
 * into a single unified API for tag operations within the MetadataPanel.
 * 
 * This hook follows the composition pattern, where multiple specialized hooks
 * are combined to create a more powerful hook with a unified interface.
 * 
 * @param props - TagOperationsProps containing contentId and other tag configuration
 * @returns Combined tag operations API with state, fetching and mutation capabilities
 */
export function useTagOperations(props: TagOperationsProps) {
  const { contentId } = props;
  
  // Compose the hooks
  const tagState = useTagState();
  const { fetchTags, isLoading, error } = useTagFetch({ contentId });
  const { 
    createTag, 
    deleteTag, 
    isCreating, 
    isDeleting 
  } = useTagMutations();
  
  // Initial fetch when the component mounts or contentId changes
  useEffect(() => {
    if (contentId && isValidContentId(contentId)) {
      fetchTags().then(tags => {
        if (Array.isArray(tags)) {
          tagState.setTags(tags);
        }
      });
    }
  }, [contentId, fetchTags, tagState]);

  // Create wrapper functions for better API
  const handleAddTag = async (name: string, typeId?: string) => {
    if (!contentId) return;
    
    await createTag({ 
      contentId, 
      name, 
      typeId 
    });
    
    // Refetch tags to update the list
    const tags = await fetchTags();
    tagState.setTags(tags);
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!contentId) return;
    
    await deleteTag({ 
      id: tagId, 
      contentId 
    });
    
    // Refetch tags to update the list
    const tags = await fetchTags();
    tagState.setTags(tags);
  };
  
  return {
    ...tagState,
    fetchTags,
    isLoading,
    error,
    handleAddTag,
    handleDeleteTag,
    isCreating,
    isDeleting
  };
}
