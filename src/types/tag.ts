
/**
 * Tag Type Definitions
 * 
 * This file defines the Tag interface and related utilities for working with tags
 * throughout the application. It serves as the single source of truth for tag types.
 */

/**
 * Tag Interface
 * 
 * Core tag data structure used throughout the application
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
 * Tag with additional properties for UI display
 */
export interface AugmentedTag extends Tag {
  isDragging?: boolean;
  isNew?: boolean;
}

/**
 * Tag position for reordering operations
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Tag group for categorized display
 */
export interface TagGroup {
  type_id: string | null;
  type_name: string | null;
  tags: Tag[];
}

/**
 * Maps API response tag to the application Tag interface
 * 
 * @param apiTag Tag data from API
 * @returns Formatted Tag object
 */
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id || '',
    name: apiTag.name || '',
    content_id: apiTag.content_id || '',
    type_id: apiTag.type_id || null,
    type_name: apiTag.type_name || null,
    display_order: typeof apiTag.display_order === 'number' ? apiTag.display_order : 0
  };
}

/**
 * Maps API response tags array to application Tag[] interface
 * 
 * @param apiTags Array of tag data from API
 * @returns Array of formatted Tag objects
 */
export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  if (!apiTags || !Array.isArray(apiTags)) return [];
  return apiTags.map(mapApiTagToTag);
}

/**
 * Ensures a tag is non-nullable with default values for missing fields
 * 
 * @param tag Tag data that might be incomplete
 * @returns Complete Tag object with defaults for missing values
 */
export function ensureNonNullableTag(tag: Partial<Tag> | null | undefined): Tag {
  if (!tag) {
    return {
      id: `temp-${Date.now()}`,
      name: '',
      content_id: '',
      type_id: null,
      display_order: 0
    };
  }
  
  return {
    id: tag.id || `temp-${Date.now()}`,
    name: tag.name || '',
    content_id: tag.content_id || '',
    type_id: tag.type_id || null,
    display_order: typeof tag.display_order === 'number' ? tag.display_order : 0
  };
}

/**
 * Filters out duplicate tags based on name (case insensitive)
 * 
 * @param tags Array of tags to filter
 * @returns Filtered array with no duplicate names
 */
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  if (!tags || !Array.isArray(tags)) return [];
  
  const uniqueTags: Tag[] = [];
  const tagNames = new Set<string>();
  
  tags.forEach(tag => {
    const normalizedName = tag.name.toLowerCase().trim();
    if (!tagNames.has(normalizedName)) {
      tagNames.add(normalizedName);
      uniqueTags.push(tag);
    }
  });
  
  return uniqueTags;
}

/**
 * Converts an array of TagPosition objects to an array of Tags
 * by mapping positions to the corresponding tags
 * 
 * @param positions Array of position data
 * @param currentTags Current tags to map positions to
 * @returns Array of Tags with updated display_order
 */
export function convertTagPositionsToTags(positions: TagPosition[], currentTags: Tag[]): Tag[] {
  if (!positions || !Array.isArray(positions)) return currentTags;
  
  // Create a lookup map for current tags
  const tagMap = new Map<string, Tag>();
  currentTags.forEach(tag => tagMap.set(tag.id, tag));
  
  // Map positions to tags and update display_order
  return positions.map((position, index) => {
    const tag = tagMap.get(position.id);
    if (!tag) {
      console.error(`Tag with id ${position.id} not found in current tags`);
      return null;
    }
    return {
      ...tag,
      display_order: position.position !== undefined ? position.position : index
    };
  }).filter((tag): tag is Tag => tag !== null);
}
