
/**
 * Tag operations types
 */

// Tag entity returned from API
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string;
  type_name?: string;
}

// Parameters for tag operations
export interface TagOperationParams {
  name: string;
  contentId: string;
  typeId?: string;
}

// Tag position for reordering operations
export interface TagPosition {
  id: string;
  position: number;
}

// Props for useTagOperations hook
export interface UseTagOperationsProps {
  contentId: string;
}

// Result from useTagOperations hook
export interface UseTagOperationsResult {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  newTag: string;
  setNewTag: (value: string) => void;
  handleAddTag: (typeId?: string) => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleReorderTags: (tagPositions: TagPosition[]) => Promise<void>;
  handleRefresh: () => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

// Props for useTagState hook
export interface UseTagStateProps {
  // Any specific initialization props
}

// Result from useTagState hook
export interface UseTagStateResult {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

// Props for useTagFetch hook
export interface UseTagFetchProps {
  contentId: string;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

// Result from useTagFetch hook
export interface UseTagFetchResult {
  fetchTags: () => Promise<Tag[]>;
}

// Props for useTagMutations hook
export interface UseTagMutationsProps {
  contentId: string;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  tags: Tag[];
}

// Result from useTagMutations hook
export interface UseTagMutationsResult {
  addTag: (params: TagOperationParams) => Promise<boolean>;
  deleteTag: (params: { tagId: string; contentId: string }) => Promise<boolean>;
  reorderTags: (tagPositions: TagPosition[]) => Promise<boolean>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

// Utility function to map API tag to our Tag model
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id,
    name: apiTag.name,
    content_id: apiTag.content_id || '',
    type_id: apiTag.type_id || undefined,
    type_name: apiTag.type_name || undefined
  };
}
