
/**
 * Tag Types
 * 
 * This file defines the core Tag interface and related utilities
 * for working with tags throughout the application.
 */

/**
 * Tag interface
 * Represents a tag associated with a content item
 * Note: content_id is intentionally kept as string to support both UUID and temporary IDs
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string; // Kept as string to support both UUID and temporary IDs
  type_id: string | null;
  type_name?: string | null;
  display_order: number;
}

/**
 * API Tag interface
 * Represents a tag as it exists in the database
 */
export interface ApiTag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
}

/**
 * Augmented Tag interface with additional properties
 */
export interface AugmentedTag extends Tag {
  type_name?: string;
  is_new?: boolean;
}

/**
 * Validates if an object is a valid Tag
 * 
 * @param obj Object to validate
 * @returns True if the object is a valid Tag
 */
export function isValidTag(obj: any): obj is Tag {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.content_id === 'string' &&
    (obj.type_id === null || typeof obj.type_id === 'string') &&
    typeof obj.display_order === 'number'
  );
}

/**
 * Tag type object for grouping tags by type
 */
export interface TagType {
  id: string;
  name: string;
  description?: string | null;
}

/**
 * Filter duplicate tags based on tag name
 * 
 * @param tags Array of tags to filter
 * @returns Array of tags with duplicates removed
 */
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  if (!tags || !Array.isArray(tags)) return [];
  
  const uniqueNames = new Set<string>();
  return tags.filter(tag => {
    const name = tag.name.toLowerCase();
    if (uniqueNames.has(name)) {
      return false;
    }
    uniqueNames.add(name);
    return true;
  });
}

/**
 * Convert an API tag to the internal Tag format
 * 
 * @param apiTag API tag object
 * @returns Formatted Tag object
 */
export function mapApiTagToTag(apiTag: ApiTag): Tag {
  return {
    id: apiTag.id,
    name: apiTag.name,
    content_id: apiTag.content_id,
    type_id: apiTag.type_id,
    display_order: apiTag.display_order || 0
  };
}

/**
 * Convert multiple API tags to internal Tag format
 * 
 * @param apiTags Array of API tag objects
 * @returns Array of formatted Tag objects
 */
export function mapApiTagsToTags(apiTags: ApiTag[]): Tag[] {
  return apiTags.map(mapApiTagToTag);
}

/**
 * Ensure a tag has non-nullable properties
 * 
 * @param tag Tag to process
 * @returns Tag with non-nullable properties
 */
export function ensureNonNullableTag(tag: Partial<Tag>): Tag {
  return {
    id: tag.id || `temp-${Date.now()}`,
    name: tag.name || '',
    content_id: tag.content_id || '',
    type_id: tag.type_id || null,
    display_order: tag.display_order || 0
  };
}

/**
 * Converts an array of tag positions to an array of tags with updated display_order
 * 
 * @param positions Array of tag positions (id and position)
 * @param existingTags Existing tags array to update
 * @returns Array of tags with updated display_order values
 */
export function convertTagPositionsToTags(
  positions: { id: string; position: number }[],
  existingTags: Tag[]
): Tag[] {
  if (!positions || !existingTags) return [];
  
  const updatedTags = [...existingTags];
  
  // Create a map for quick lookup
  const tagMap = new Map<string, number>();
  existingTags.forEach((tag, index) => {
    tagMap.set(tag.id, index);
  });
  
  // Update display_order based on positions
  positions.forEach(pos => {
    const index = tagMap.get(pos.id);
    if (index !== undefined) {
      updatedTags[index] = {
        ...updatedTags[index],
        display_order: pos.position
      };
    }
  });
  
  return updatedTags;
}
