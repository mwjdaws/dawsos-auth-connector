
/**
 * Tag type for UI operations
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  type_name?: string | null;
}

/**
 * Bridge for database compatibility
 */
export interface TagDB {
  id: string;
  name: string;
  content_id: string | null;
  type_id: string | null;
  type_name?: string | null;
}

/**
 * Tag position for reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Tag state hook result
 */
export interface UseTagStateResult {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

/**
 * Tag operations hook params
 */
export interface UseTagOperationsProps {
  contentId: string;
}

/**
 * Tag operations hook result
 */
export interface UseTagOperationsResult {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  newTag: string;
  setNewTag: (value: string) => void;
  handleAddTag: () => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleReorderTags: (tagPositions: TagPosition[]) => Promise<void>;
  handleRefresh: () => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

/**
 * Tag fetch hook params
 */
export interface UseTagFetchProps {
  contentId: string;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setError?: React.Dispatch<React.SetStateAction<Error | null>>;
}

/**
 * Tag mutations hook props
 */
export interface UseTagMutationsProps {
  contentId: string;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  tags: Tag[];
}

/**
 * Tag mutations hook result
 */
export interface UseTagMutationsResult {
  addTag: (params: { name: string; contentId: string; typeId?: string }) => Promise<boolean>;
  deleteTag: (params: { tagId: string; contentId: string }) => Promise<boolean>;
  reorderTags: (positions: TagPosition[]) => Promise<boolean>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}
