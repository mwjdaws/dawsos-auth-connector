
import { Tag as ApiTag } from "@/services/api/types";

/**
 * Tag type used within the MetadataPanel
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
}

/**
 * TagPosition type for handling tag reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Props for useTagState hook
 */
export interface UseTagStateProps {
  initialTags?: Tag[];
}

/**
 * Return type for useTagState hook
 */
export interface UseTagStateResult {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

/**
 * Props for useTagFetch hook
 */
export interface UseTagFetchProps {
  contentId: string;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

/**
 * Return type for useTagFetch hook
 */
export interface UseTagFetchResult {
  fetchTags: () => Promise<Tag[]>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Props for TagMutations hook
 */
export interface UseTagMutationsProps {
  contentId: string;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  tags: Tag[];
}

/**
 * Return type for TagMutations hook
 */
export interface UseTagMutationsResult {
  addTag: (params: { name: string, contentId: string, typeId?: string }) => Promise<Tag | null>;
  deleteTag: (params: { tagId: string, contentId: string }) => Promise<boolean>;
  reorderTags: (tagPositions: TagPosition[]) => Promise<boolean>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

/**
 * Props for useTagOperations hook
 */
export interface UseTagOperationsProps {
  contentId: string;
}

/**
 * Return type for useTagOperations hook
 */
export interface UseTagOperationsResult {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
  handleAddTag: () => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleReorderTags: (tagPositions: TagPosition[]) => Promise<void>;
  handleRefresh: () => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

// Utility type for converting API tags to internal tags
export const mapApiTagToTag = (apiTag: ApiTag): Tag => ({
  id: apiTag.id,
  name: apiTag.name,
  content_id: apiTag.content_id || "",
  type_id: apiTag.type_id
});
