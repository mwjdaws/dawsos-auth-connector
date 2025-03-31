
/**
 * Tag related types and utilities
 */

/**
 * Tag type definition
 * 
 * Represents a tag that can be associated with content
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
 * Tag group definition
 * 
 * Represents a group of tags with a common type/category
 */
export interface TagGroup {
  type: string | null;
  typeName: string | null;
  content_id: string;
  tags: Tag[];
  category?: string;
}

/**
 * Tag position for reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Sorts tags by their display order
 * 
 * @param tags Array of tags to sort
 * @returns Sorted array of tags
 */
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => {
    // First sort by display_order
    const orderDiff = (a.display_order || 0) - (b.display_order || 0);
    if (orderDiff !== 0) return orderDiff;
    
    // Then by name as fallback
    return a.name.localeCompare(b.name);
  });
}

/**
 * Creates a new tag with default values
 * 
 * @param options Initial values for the tag
 * @returns A new tag object
 */
export function createTag(options: Partial<Tag> = {}): Tag {
  return {
    id: options.id || '',
    name: options.name || '',
    content_id: options.content_id || '',
    type_id: options.type_id || null,
    type_name: options.type_name || null,
    display_order: options.display_order !== undefined ? options.display_order : 0
  };
}
