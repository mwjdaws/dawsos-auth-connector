
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
