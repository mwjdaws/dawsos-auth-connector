
/**
 * Tag type definitions
 */

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
  type_name?: string; // Making this optional for compatibility
}

export interface TagType {
  id: string;
  name: string;
}

export interface TagGroup {
  type: string | null;
  typeId: string | null;
  tags: Tag[];
}
