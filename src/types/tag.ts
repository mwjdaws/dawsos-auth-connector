
/**
 * Tag types and utilities
 */

/**
 * Base Tag interface
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  type_name?: string | null;
  display_order: number;
}

/**
 * Tag position for reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Augmented tag with additional metadata
 */
export interface AugmentedTag extends Tag {
  category?: string;
  color?: string;
  description?: string;
  isUserCreated?: boolean;
}

/**
 * Convert a database tag to a Tag interface
 */
export function mapApiTagToTag(tag: any): Tag {
  return {
    id: tag.id,
    name: tag.name,
    content_id: tag.content_id,
    type_id: tag.type_id || null,
    type_name: tag.type_name || null,
    display_order: tag.display_order || 0
  };
}

/**
 * Convert an array of database tags to Tag interfaces
 */
export function mapApiTagsToTags(tags: any[]): Tag[] {
  return tags.map(mapApiTagToTag);
}

/**
 * Ensure a tag is not null or undefined
 */
export function ensureNonNullableTag(tag: Tag | null | undefined): Tag | null {
  if (!tag) return null;
  
  return {
    id: tag.id,
    name: tag.name,
    content_id: tag.content_id,
    type_id: tag.type_id,
    type_name: tag.type_name || null,
    display_order: tag.display_order
  };
}

/**
 * Remove duplicate tags from an array
 */
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  const uniqueTagMap = new Map<string, Tag>();
  
  tags.forEach(tag => {
    const key = `${tag.name.toLowerCase()}`;
    if (!uniqueTagMap.has(key)) {
      uniqueTagMap.set(key, tag);
    }
  });
  
  return Array.from(uniqueTagMap.values());
}

/**
 * Convert tag positions to tags
 */
export function convertTagPositionsToTags(positions: TagPosition[], existingTags: Tag[]): Tag[] {
  const tagMap = new Map<string, Tag>();
  
  // Create a map of existing tags by ID
  existingTags.forEach(tag => {
    tagMap.set(tag.id, tag);
  });
  
  // Update tag positions
  positions.forEach(position => {
    const tag = tagMap.get(position.id);
    if (tag) {
      tag.display_order = position.position;
    }
  });
  
  return Array.from(tagMap.values());
}

/**
 * Validate if tag name is valid
 */
export function isValidTag(name: string): boolean {
  if (!name || name.trim().length === 0) return false;
  if (name.trim().length < 2) return false;
  if (name.trim().length > 50) return false;
  
  return true;
}
