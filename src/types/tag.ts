
/**
 * Tag-related type definitions
 */

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  type_name?: string | null;
  category?: string | null;
  display_order: number;
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
  category?: string | null;
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

/**
 * Filter out duplicate tags based on name
 */
export const filterDuplicateTags = (tags: Tag[]): Tag[] => {
  const uniqueNames = new Set<string>();
  return tags.filter(tag => {
    const normalized = tag.name.toLowerCase();
    if (uniqueNames.has(normalized)) {
      return false;
    }
    uniqueNames.add(normalized);
    return true;
  });
};

/**
 * Converts tag positions to Tag objects
 * Used for reordering tags
 */
export interface TagPosition {
  id: string;
  position: number;
}

export const convertTagPositionsToTags = (
  positions: TagPosition[], 
  existingTags: Tag[]
): Tag[] => {
  const tagsMap = new Map(existingTags.map(tag => [tag.id, tag]));
  
  return positions.map((pos, index) => {
    const tag = tagsMap.get(pos.id);
    if (!tag) {
      throw new Error(`Tag with id ${pos.id} not found in existing tags`);
    }
    return {
      ...tag,
      display_order: pos.position
    };
  });
};

/**
 * Map between API tag format and internal Tag format
 */
export const mapApiTagToTag = (apiTag: any): Tag => {
  return {
    id: apiTag.id,
    name: apiTag.name,
    content_id: apiTag.content_id,
    type_id: apiTag.type_id,
    type_name: apiTag.tag_types?.name || null,
    display_order: apiTag.display_order || 0,
    category: apiTag.category || null
  };
};

export const mapApiTagsToTags = (apiTags: any[]): Tag[] => {
  return apiTags.map(mapApiTagToTag);
};

/**
 * Ensures a tag is not null or undefined
 */
export const ensureNonNullableTag = (tag: Tag | null | undefined): Tag | null => {
  if (!tag) return null;
  return tag;
};
