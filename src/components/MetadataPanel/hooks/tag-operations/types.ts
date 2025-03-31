
/**
 * Tag operations types
 * 
 * @deprecated Import Tag types from @/types/tag instead
 */

// Re-export the unified types
import { 
  Tag, 
  TagPosition, 
  AugmentedTag,
  mapApiTagToTag,
  mapApiTagsToTags,
  ensureNonNullableTag,
  filterDuplicateTags,
  convertTagPositionsToTags
} from '@/types/tag';

export type { 
  Tag, 
  TagPosition, 
  AugmentedTag
};

export {
  mapApiTagToTag,
  mapApiTagsToTags,
  ensureNonNullableTag,
  filterDuplicateTags,
  convertTagPositionsToTags
};

export interface UseTagStateProps {
  initialTags?: Tag[];
}

export interface UseTagStateResult {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  newTag: string;
  setNewTag: (value: string) => void;
}

export interface UseTagFetchProps {
  contentId: string;
  setTags: (tags: Tag[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

export interface UseTagFetchResult {
  fetchTags: () => Promise<Tag[]>;
  isLoading: boolean;
  error: Error | null;
  tags?: Tag[]; // Added for compatibility
}

export interface UseTagMutationsProps {
  contentId: string;
  setTags: (tags: Tag[]) => void;
  tags: Tag[];
}

export interface AddTagParams {
  name: string;
  contentId: string;
  typeId?: string | null;
}

export interface DeleteTagParams {
  tagId: string;
  contentId: string;
}

export interface UseTagMutationsResult {
  addTag: (params: AddTagParams) => Promise<boolean>;
  deleteTag: (params: DeleteTagParams) => Promise<boolean>;
  reorderTags: (positions: TagPosition[]) => Promise<boolean>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

export interface UseTagOperationsProps {
  contentId: string;
}

export interface UseTagOperationsResult {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  newTag: string;
  setNewTag: (value: string) => void;
  handleAddTag: (typeId?: string | null) => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleReorderTags: (updatedTags: Tag[]) => Promise<void>;
  handleRefresh: () => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
  // Added for backward compatibility
  isTagsLoading?: boolean; 
  tagsError?: Error | null;
}
