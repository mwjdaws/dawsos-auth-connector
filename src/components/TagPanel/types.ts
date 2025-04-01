
import { Tag } from '@/types/tag';

/**
 * Tag data interface for internal use
 */
export interface TagData {
  id: string;
  name: string;
  type?: string | null;
  typeId?: string | null;
}

/**
 * Tag display properties interface
 */
export interface TagDisplay extends TagData {
  color?: string;
  icon?: string;
  count?: number;
}

/**
 * Tag group interface for grouped tags display
 */
export interface TagGroup {
  id: string;
  name: string;
  tags: Tag[];
  color?: string;
  icon?: string;
}

/**
 * Tag position interface for drag and drop
 */
export interface TagPosition {
  id: string;
  name: string;
  typeId: string | null;
  displayOrder: number;
}

/**
 * Props for the GroupedTagList component
 */
export interface GroupedTagListProps {
  tags: Tag[];
  groups: TagGroup[];
  editable?: boolean;
  onTagClick?: (tag: Tag) => void;
  onTagDelete?: (tagId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}
