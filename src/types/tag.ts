
/**
 * Type definitions for tags and tag types
 */

/**
 * Tag type interface representing a category or type for tags
 */
export interface TagType {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
}

/**
 * Tag interface representing a tag attached to content
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
  type_name: string;
  color?: string;
  icon?: string;
}

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
 * Converts a Supabase row to a Tag object
 * @param row The Supabase row to convert
 * @returns Tag
 */
export const tagFromRow = (row: any): Tag => ({
  id: row.id,
  name: row.name,
  content_id: row.content_id,
  type_id: row.type_id,
  display_order: row.display_order,
  type_name: row.tag_type?.name || 'default',
  color: row.tag_type?.color || null,
  icon: row.tag_type?.icon || null,
});

/**
 * Converts a Supabase row to a TagType object
 * @param row The Supabase row to convert
 * @returns TagType
 */
export const tagTypeFromRow = (row: any): TagType => ({
  id: row.id,
  name: row.name,
  description: row.description,
  color: row.color,
  icon: row.icon,
});

/**
 * Utility function to check if a value is a Tag
 * @param value The value to check
 * @returns boolean
 */
export function isTag(value: any): value is Tag {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'content_id' in value &&
    'type_id' in value &&
    'display_order' in value &&
    'type_name' in value
  );
}

/**
 * Sort tags by display order
 * @param tags Array of tags to sort
 * @returns Sorted tags
 */
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => a.display_order - b.display_order);
}

/**
 * Filters duplicate tags from an array
 * @param tags Array of tags
 * @returns Array without duplicates
 */
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  const seen = new Set<string>();
  return tags.filter(tag => {
    const key = `${tag.name}-${tag.type_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Converts API tag data to Tag objects
 * @param apiTag API tag data
 * @returns Tag
 */
export const mapApiTagToTag = (apiTag: any): Tag => {
  return {
    id: apiTag.id,
    name: apiTag.name,
    content_id: apiTag.content_id,
    type_id: apiTag.type_id,
    display_order: apiTag.display_order || 0,
    type_name: apiTag.type_name || 'default',
    color: apiTag.color,
    icon: apiTag.icon
  };
};

/**
 * Converts API tag data array to Tag objects array
 * @param apiTags API tag data array
 * @returns Array of Tag objects
 */
export const mapApiTagsToTags = (apiTags: any[]): Tag[] => {
  return apiTags.map(mapApiTagToTag);
};

/**
 * Ensures tag is not null or undefined
 * @param tag Tag or undefined
 * @returns Tag or null
 */
export const ensureNonNullableTag = (tag: Tag | undefined): Tag | null => {
  return tag || null;
};

/**
 * Converts TagPosition array to Tag array
 * @param positions TagPosition array
 * @param contentId Content ID to assign
 * @returns Array of Tag objects
 */
export const convertTagPositionsToTags = (positions: TagPosition[], contentId: string): Tag[] => {
  return positions.map(position => ({
    id: position.id,
    name: position.name,
    content_id: contentId,
    type_id: position.typeId,
    display_order: position.displayOrder,
    type_name: 'default'
  }));
};
