
import { Tag as ApiTag } from '@/hooks/metadata/useTagsQuery';
import { TagPosition } from '@/utils/validation/types';

// Define the Tag interface to be compatible with the API Tag
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  type_name?: string | null;
}

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
}

export interface UseTagMutationsProps {
  contentId: string;
  setTags: (tags: Tag[]) => void;
  tags: Tag[];
}

export interface TagOperationParams {
  tagId: string;
  contentId: string;
}

export interface AddTagParams {
  name: string;
  contentId: string;
  typeId?: string;
}

export interface UseTagMutationsResult {
  addTag: (params: AddTagParams) => Promise<Tag | null>;
  deleteTag: (params: TagOperationParams) => Promise<void>;
  reorderTags: (positions: TagPosition[]) => Promise<void>;
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
  setNewTag: (newTag: string) => void;
  handleAddTag: (typeId?: string | null) => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleReorderTags: (positions: TagPosition[]) => Promise<void>;
  handleRefresh: () => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

// Conversion utilities
export function mapApiTagToTag(apiTag: ApiTag): Tag {
  return {
    id: apiTag.id,
    name: apiTag.name,
    content_id: apiTag.content_id || '',
    type_id: apiTag.type_id,
    type_name: apiTag.type_name
  };
}
