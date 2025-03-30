
import { isValidContentId } from "@/utils/validation";
import { useTagState } from "./useTagState";
import { useTagFetch } from "./useTagFetch";
import { useTagMutations } from "./useTagMutations";
import { Tag, TagOperationsProps } from "./types";

export const useTagOperations = (contentId: string, props?: Omit<TagOperationsProps, 'contentId'>) => {
  // Combine the contentId with any additional props
  const fullProps: TagOperationsProps = { contentId, ...props };

  // Get state management for tags
  const tagState = useTagState();
  
  // Setup tag fetching
  const tagFetch = useTagFetch({ contentId });
  
  // Setup tag mutations
  const tagMutations = useTagMutations({ contentId });

  // Handle refreshing tag data
  const handleRefresh = async () => {
    if (isValidContentId(contentId)) {
      const tags = await tagFetch.fetchTags();
      tagState.setTags(tags);
    }
  };

  // Update tag order (positions)
  const handleUpdateTagOrder = async (tags: Tag[]) => {
    console.log("Updating tag order:", tags);
    // Reordering implementation would go here
    return true;
  };

  return {
    // State
    tags: tagState.tags,
    setTags: tagState.setTags,
    newTag: tagState.newTag,
    setNewTag: tagState.setNewTag,
    
    // Data fetching
    fetchTags: tagFetch.fetchTags,
    isLoading: tagFetch.isLoading,
    error: tagFetch.error,
    
    // Operations
    handleAddTag: tagMutations.handleAddTag,
    handleDeleteTag: tagMutations.handleDeleteTag,
    handleUpdateTagOrder,
    handleRefresh,
    
    // Mutation states
    isAdding: tagMutations.isAdding,
    isDeleting: tagMutations.isDeleting
  };
};
