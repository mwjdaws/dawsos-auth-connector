
import { Tag } from '@/types';

/**
 * Props for tag operations hook
 */
export interface UseTagOperationsProps {
  contentId: string;
}

/**
 * Tag position for reordering
 * Making it properly exported for all components that need it
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Parameters for adding a tag
 */
export interface AddTagParams {
  contentId: string;
  name: string;
  typeId?: string | null; // Made nullable and optional
}

/**
 * Parameters for deleting a tag
 */
export interface DeleteTagParams {
  contentId: string;
  tagId: string;
}

/**
 * Result type for tag operations hook
 */
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

/**
 * Compatible Tag for backward compatibility
 * This helps bridge differences between Tag definitions
 */
export function createCompatibleTag(tag: {
  id: string;
  name: string;
  content_id: string | null;
  type_id: string | null | undefined;
  type_name?: string | null;
}): Tag {
  return {
    id: tag.id,
    name: tag.name,
    content_id: tag.content_id || '',
    type_id: tag.type_id === undefined ? null : tag.type_id,
    type_name: tag.type_name || null
  };
}
