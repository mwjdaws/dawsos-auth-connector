
/**
 * Represents a tag associated with a content item
 */
export interface Tag {
  /**
   * Unique identifier for the tag
   */
  id: string;
  
  /**
   * Display name of the tag
   */
  name: string;
  
  /**
   * ID of the content the tag is associated with
   */
  content_id: string;
  
  /**
   * ID of the tag type, if any
   */
  type_id: string | null;
  
  /**
   * Name of the tag type, if any (for display purposes)
   */
  type_name: string | null;
  
  /**
   * The display order for this tag
   */
  display_order: number;
  
  /**
   * Optional color for tag display
   */
  color?: string;
}

/**
 * Position information for tag reordering
 */
export interface TagPosition {
  /**
   * ID of the tag
   */
  id: string;
  
  /**
   * New position of the tag
   */
  position: number;
}

/**
 * Tag grouped by type
 */
export interface TagGroup {
  /**
   * ID of the type, if any
   */
  type_id: string | null;
  
  /**
   * Name of the type, if any
   */
  type_name: string | null;
  
  /**
   * Tags in this group
   */
  tags: Tag[];
  
  /**
   * Optional ID for the group
   */
  id?: string;
  
  /**
   * Optional name for the group
   */
  name?: string;
}

/**
 * Legacy tag display format
 */
export interface TagDisplay {
  id: string;
  name: string;
  color?: string;
  type?: string | null;
}

/**
 * Legacy tag data format
 */
export interface TagData {
  id: string;
  name: string;
  contentId: string;
  typeId?: string | null;
  typeName?: string | null;
  displayOrder?: number;
  color?: string;
}

/**
 * Data required for creating a new tag
 */
export interface CreateTagData {
  /**
   * Name of the new tag
   */
  name: string;
  
  /**
   * ID of the content to associate with
   */
  contentId: string;
  
  /**
   * Optional tag type ID
   */
  typeId?: string | null;
}

/**
 * Data required for deleting a tag
 */
export interface DeleteTagData {
  /**
   * ID of the tag to delete
   */
  tagId: string;
  
  /**
   * ID of the associated content
   */
  contentId: string;
}

/**
 * Convert API tag format to internal Tag format
 */
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id || '',
    name: apiTag.name || '',
    content_id: apiTag.content_id || apiTag.contentId || '',
    type_id: apiTag.type_id ?? apiTag.typeId ?? null,
    type_name: apiTag.type_name ?? apiTag.typeName ?? null,
    display_order: apiTag.display_order ?? apiTag.displayOrder ?? 0,
    color: apiTag.color ?? undefined,
  };
}

/**
 * Convert API tags to internal Tag format
 */
export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  if (!Array.isArray(apiTags)) return [];
  return apiTags.map(mapApiTagToTag);
}

/**
 * Safely convert nullable values to non-nullable
 */
export function ensureNonNullableTag(tag: Tag | null | undefined): Tag {
  if (!tag) {
    return {
      id: '',
      name: '',
      content_id: '',
      type_id: null,
      type_name: null,
      display_order: 0
    };
  }
  return tag;
}

/**
 * Convert tag positions to tag array
 */
export function convertTagPositionsToTags(positions: TagPosition[], existingTags: Tag[]): Tag[] {
  return positions.map(pos => {
    const tag = existingTags.find(t => t.id === pos.id);
    if (!tag) {
      return {
        id: pos.id,
        name: '',
        content_id: '',
        type_id: null,
        type_name: null,
        display_order: pos.position
      };
    }
    return {
      ...tag,
      display_order: pos.position
    };
  });
}

/**
 * Sort tags by display order
 */
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => a.display_order - b.display_order);
}

/**
 * Filter duplicate tags based on name
 */
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  const seen = new Set<string>();
  return tags.filter(tag => {
    const normalized = tag.name.toLowerCase();
    if (seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}
