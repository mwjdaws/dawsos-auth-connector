
/**
 * Tag Types
 * 
 * This file defines the core Tag interface and related utilities
 * for working with tags throughout the application.
 */

/**
 * Tag interface
 * Represents a tag associated with a content item
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
