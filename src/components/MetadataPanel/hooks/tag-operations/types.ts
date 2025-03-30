
/**
 * Tag operations types
 */

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string;
  type_name?: string;
}

export interface TagPosition {
  id: string;
  position: number;
}

export interface TagOperationParams {
  name: string;
  contentId: string;
  typeId?: string;
  tagId?: string;
}

export interface UseTagOperationsProps {
  contentId: string;
  initialTags?: Tag[];
}

export interface UseTagOperationsResult {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  newTag: string;
  setNewTag: (value: string) => void;
  handleAddTag: (typeId?: string | null) => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleRefresh: () => void;
}

export interface UseTagFetchProps {
  contentId: string;
}

export interface UseTagFetchResult {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  fetchTags: () => Promise<Tag[]>;
}

export interface UseTagStateProps {
  contentId: string;
  initialTags?: Tag[];
}

export interface UseTagStateResult {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  newTag: string;
  setNewTag: (value: string) => void;
}

export interface UseTagMutationsProps {
  contentId: string;
}

export interface UseTagMutationsResult {
  addTag: (params: TagOperationParams) => Promise<boolean>;
  deleteTag: (params: { tagId: string; contentId: string }) => Promise<boolean>;
  updateTagOrder: (tagPositions: TagPosition[]) => Promise<boolean>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isUpdatingOrder: boolean;
  error: Error | null;
}

/**
 * Convert API tag format to internal Tag format
 */
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id || '',
    name: apiTag.name || '',
    content_id: apiTag.content_id || '',
    type_id: apiTag.type_id || undefined,
    type_name: apiTag.tag_types?.name || undefined
  };
}
