
import { useEffect } from "react";
import { TagOperationsProps } from "./types";
import { useTagState } from "./useTagState";
import { useTagFetch } from "./useTagFetch";
import { useTagMutations } from "./useTagMutations";

export function useTagOperations(props: TagOperationsProps) {
  const { contentId } = props;
  
  // Compose the hooks
  const tagState = useTagState();
  const { fetchTags, isLoading, error } = useTagFetch({ contentId });
  const { handleAddTag, handleDeleteTag } = useTagMutations(props, tagState);
  
  // Initial fetch when the component mounts or contentId changes
  useEffect(() => {
    if (contentId) {
      fetchTags().then(tags => {
        tagState.setTags(tags);
      });
    }
  }, [contentId]);
  
  return {
    ...tagState,
    fetchTags,
    isLoading,
    error,
    handleAddTag,
    handleDeleteTag
  };
}
