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
    'display_order' in value
  );
}
