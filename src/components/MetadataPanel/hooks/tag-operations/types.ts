
import { SetStateAction, Dispatch } from 'react';

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string;
  type_name?: string;
}

export interface AddTagParams {
  name: string;
  contentId: string;
  typeId?: string;
}

export interface TagOperationParams {
  tagId: string;
  contentId: string;
}

export interface TagPosition {
  id: string;
  position: number;
}

// State Hook Props/Results
export interface UseTagStateProps {
  initialTags?: Tag[];
}

export interface UseTagStateResult {
  tags: Tag[];
  setTags: Dispatch<SetStateAction<Tag[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  error: Error | null;
  setError: Dispatch<SetStateAction<Error | null>>;
  newTag: string;
  setNewTag: Dispatch<SetStateAction<string>>;
}

// Fetch Hook Props/Results
export interface UseTagFetchProps {
  contentId: string;
  setTags: (tags: Tag[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

export interface UseTagFetchResult {
  tags: Tag[];
  fetchTags: () => Promise<Tag[]>;
  isLoading: boolean;
  error: Error | null;
}

// Mutations Hook Props/Results
export interface UseTagMutationsProps {
  contentId: string;
  setTags: (tags: Tag[]) => void;
  tags: Tag[];
}

export interface UseTagMutationsResult {
  addTag: (params: AddTagParams) => Promise<Tag | null>;
  deleteTag: (params: TagOperationParams) => Promise<void>;
  reorderTags: (positions: TagPosition[]) => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

// Main Operations Hook
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
  handleReorderTags: (tagPositions: TagPosition[]) => Promise<void>;
  handleRefresh: () => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}
