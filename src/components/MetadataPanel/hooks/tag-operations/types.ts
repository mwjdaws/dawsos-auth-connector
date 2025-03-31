
import { Tag } from '@/types/tag';

/**
 * Result of the useTagState hook
 */
export interface UseTagStateResult {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  newTag: string;
  setNewTag: (newTag: string) => void;
}

/**
 * Result of the useTagFetch hook
 */
export interface UseTagFetchResult {
  fetchTags: () => Promise<Tag[]>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Result of the useTagMutations hook
 */
export interface UseTagMutationsResult {
  addTag: (params: { name: string; contentId: string; typeId?: string | null }) => Promise<Tag | null>;
  deleteTag: (params: { tagId: string; contentId: string }) => Promise<boolean>;
  reorderTags: (positions: { id: string; position: number }[]) => Promise<boolean>;
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
  setNewTag: (tag: string) => void;
  handleAddTag: (typeId?: string | null) => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleReorderTags: (tags: Tag[]) => Promise<void>;
  handleRefresh: () => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

/**
 * Position information for tag reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Tag representation
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  display_order?: number;
}
