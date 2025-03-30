
/**
 * Tag model interface
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  type_name?: string | null;
}

/**
 * Tag state hook result interface
 */
export interface UseTagStateResult {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  isLoading?: boolean;
  error?: Error | null;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setError?: React.Dispatch<React.SetStateAction<Error | null>>;
}

/**
 * Tag fetch options
 */
export interface UseTagFetchOptions {
  contentId: string;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setError?: React.Dispatch<React.SetStateAction<Error | null>>;
}

/**
 * Tag fetch result interface
 */
export interface UseTagFetchResult {
  fetchTags: () => Promise<Tag[]>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Tag mutation options interface
 */
export interface UseTagMutationsProps {
  contentId: string;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  tags?: Tag[];
}

/**
 * Tag mutation result interface
 */
export interface UseTagMutationsResult {
  addTag: (params: { name: string; contentId: string; type_id?: string | null }) => Promise<Tag | null>;
  deleteTag: (params: { tagId: string; contentId: string }) => Promise<boolean>;
  reorderTags: (tagPositions: { id: string; position: number }[]) => Promise<boolean>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

/**
 * Result of the useTagOperations hook
 */
export interface UseTagOperationsResult {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  newTag: string;
  setNewTag: (value: string) => void;
  handleAddTag: () => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleReorderTags: (tagPositions: { id: string; position: number }[]) => Promise<void>;
  handleRefresh: () => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}
