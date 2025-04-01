
/**
 * Tag Types
 * Defines the structure for tags and tag-related functionality
 */

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
  type_name: string; // Required field for Tag objects
  color?: string;
  icon?: string;
}

/**
 * Represents a tag with a specific type
 */
export interface TypedTag extends Tag {
  type: string;
  color?: string;
}

/**
 * Tag position used for reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Tag type definition
 */
export interface TagType {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  description?: string;
}

/**
 * Tag Group for displaying grouped tags
 */
export interface TagGroup {
  id: string;
  name: string;
  tags: Tag[];
  color?: string;
  icon?: string;
}

/**
 * Helper functions for tag operations
 */

/**
 * Sort tags by display order
 */
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => a.display_order - b.display_order);
}

/**
 * Filter out duplicate tags by name (case-insensitive)
 */
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  const uniqueTags: Tag[] = [];
  const tagNames = new Set<string>();
  
  tags.forEach(tag => {
    const lowerName = tag.name.toLowerCase();
    if (!tagNames.has(lowerName)) {
      tagNames.add(lowerName);
      uniqueTags.push(tag);
    }
  });
  
  return uniqueTags;
}

/**
 * Ensure all tag fields are non-nullable
 */
export function ensureNonNullableTag(tag: Partial<Tag>): Tag {
  return {
    id: tag.id || '',
    name: tag.name || '',
    content_id: tag.content_id || '',
    type_id: tag.type_id || null,
    display_order: tag.display_order || 0,
    type_name: tag.type_name || '',
    color: tag.color || undefined,
    icon: tag.icon || undefined
  };
}

/**
 * Convert from API tag to Tag interface
 */
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id || '',
    name: apiTag.name || '',
    content_id: apiTag.content_id || '',
    type_id: apiTag.type_id || null,
    display_order: apiTag.display_order || 0,
    type_name: apiTag.type_name || '',
    color: apiTag.color || undefined,
    icon: apiTag.icon || undefined
  };
}

/**
 * Convert a list of API tags to Tag interface
 */
export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  return apiTags.map(mapApiTagToTag);
}

/**
 * Convert tag positions to tags
 */
export function convertTagPositionsToTags(tagPositions: TagPosition[], tags: Tag[]): Tag[] {
  return tagPositions.map(pos => {
    const tag = tags.find(t => t.id === pos.id);
    if (!tag) return null;
    return {
      ...tag,
      display_order: pos.position
    };
  }).filter(Boolean) as Tag[];
}
