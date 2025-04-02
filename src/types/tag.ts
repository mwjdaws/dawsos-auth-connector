
/**
 * Type definitions for tag-related functionality
 */

/**
 * Tag information
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
  type_name: string;
}

/**
 * Tag position for reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Tag group for displaying tags grouped by type
 */
export interface TagGroup {
  id: string;
  name: string;
  tags: Tag[];
}

/**
 * Sort tags by display_order
 */
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => a.display_order - b.display_order);
}

/**
 * Filter out duplicate tags based on ID
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
 * Map API tag to internal Tag format
 */
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id,
    name: apiTag.name,
    content_id: apiTag.content_id,
    type_id: apiTag.type_id,
    display_order: apiTag.display_order || 0,
    type_name: apiTag.tag_types?.name || ''
  };
}

/**
 * Map API tags to internal Tag format
 */
export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  return apiTags.map(mapApiTagToTag);
}

/**
 * Ensure tag is not nullable
 */
export function ensureNonNullableTag(tag: Tag | null | undefined): Tag | null {
  if (!tag) return null;
  return {
    ...tag,
    type_id: tag.type_id || null,
    type_name: tag.type_name || ''
  };
}

/**
 * Convert tag positions to tags
 */
export function convertTagPositionsToTags(
  positions: TagPosition[], 
  existingTags: Tag[]
): Tag[] {
  return positions.map(position => {
    const matchingTag = existingTags.find(tag => tag.id === position.id);
    if (!matchingTag) {
      throw new Error(`Tag with ID ${position.id} not found in existing tags`);
    }
    return {
      ...matchingTag,
      display_order: position.position
    };
  });
}
