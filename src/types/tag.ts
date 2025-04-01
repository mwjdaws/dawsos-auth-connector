
/**
 * Tag-related type definitions
 */

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  type_name?: string | null;
  display_order: number;
  category?: string | null;
}

export interface TagType {
  id: string;
  name: string;
}

export interface TagRelation {
  id: string;
  tag_id: string;
  related_tag_id: string;
  relation_type: string;
}

export interface TagGroup {
  name: string;
  category: string;
  type_id: string | null;
  tags: Tag[];
}

/**
 * Utility function to create a basic tag object
 */
export const createTag = (name: string, contentId: string): Tag => {
  return {
    id: `temp-${Date.now()}`,
    name,
    content_id: contentId,
    type_id: null,
    display_order: 0
  };
};

/**
 * Sort tags by display order
 */
export const sortTagsByDisplayOrder = (tags: Tag[]): Tag[] => {
  return [...tags].sort((a, b) => a.display_order - b.display_order);
};
