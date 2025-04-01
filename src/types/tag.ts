
/**
 * Tag interface
 * Represents a tag that can be added to content
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string;
  display_order: number;
  type_name: string;
  color?: string;
  icon?: string;
}

/**
 * Tag type interface
 * Represents the type or category a tag belongs to
 */
export interface TagType {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

/**
 * Sort tags by display order
 * @param tags Array of tags to sort
 * @returns Sorted array of tags
 */
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => a.display_order - b.display_order);
}

/**
 * Map API tag to Tag interface
 * @param apiTag Tag from API
 * @returns Tag with proper interface
 */
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id,
    name: apiTag.name,
    content_id: apiTag.content_id,
    type_id: apiTag.type_id || '',
    display_order: apiTag.display_order || 0,
    type_name: apiTag.type_name || '',
    color: apiTag.color,
    icon: apiTag.icon
  };
}

/**
 * Map API tags to Tag interface
 * @param apiTags Tags from API
 * @returns Tags with proper interface
 */
export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  return apiTags.map(mapApiTagToTag);
}

/**
 * Ensure tag is not nullable
 * @param tag Tag to check
 * @returns Tag or null if invalid
 */
export function ensureNonNullableTag(tag: Partial<Tag> | null): Tag | null {
  if (!tag || !tag.id || !tag.name) {
    return null;
  }
  
  return {
    id: tag.id,
    name: tag.name,
    content_id: tag.content_id || '',
    type_id: tag.type_id || '',
    display_order: tag.display_order || 0,
    type_name: tag.type_name || '',
    color: tag.color,
    icon: tag.icon
  };
}

/**
 * Filter out duplicate tags based on ID
 * @param tags Tags to filter
 * @returns Filtered tags with no duplicates
 */
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  const uniqueIds = new Set<string>();
  return tags.filter(tag => {
    if (uniqueIds.has(tag.id)) {
      return false;
    }
    uniqueIds.add(tag.id);
    return true;
  });
}

/**
 * TagPosition interface for reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Convert tag positions to tag objects
 * @param positions Tag positions
 * @param existingTags Existing tags to match with positions
 * @returns Updated tags with new positions
 */
export function convertTagPositionsToTags(positions: TagPosition[], existingTags: Tag[]): Tag[] {
  const tagMap = new Map<string, Tag>();
  existingTags.forEach(tag => tagMap.set(tag.id, tag));
  
  return positions.map(pos => {
    const tag = tagMap.get(pos.id);
    if (!tag) {
      throw new Error(`Tag with ID ${pos.id} not found`);
    }
    return {
      ...tag,
      display_order: pos.position
    };
  });
}
