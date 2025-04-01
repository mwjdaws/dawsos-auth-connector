
/**
 * Tag related interfaces and types
 */

/**
 * Base Tag interface
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
  type_name?: string;
  color?: string;
  icon?: string;
}

/**
 * Tag Type interface
 */
export interface TagType {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
}

/**
 * Tag Group interface
 */
export interface TagGroup {
  id: string;
  name: string;
  tags: Tag[];
  type?: TagType | null;
  content_id: string;
}

/**
 * Tag Creation Params
 */
export interface CreateTagParams {
  name: string;
  content_id: string;
  type_id?: string | null;
  display_order?: number;
}

/**
 * Tag Update Params
 */
export interface UpdateTagParams {
  id: string;
  name?: string;
  type_id?: string | null;
  display_order?: number;
}

/**
 * Tag Deletion Params
 */
export interface DeleteTagParams {
  id: string;
  content_id?: string;
}

/**
 * Tag Reordering Params
 */
export interface ReorderTagsParams {
  content_id: string;
  tagOrder: { id: string; display_order: number }[];
}

/**
 * Tag Filtering Options
 */
export interface TagFilterOptions {
  content_id?: string;
  type_id?: string | null;
  text?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  direction?: 'asc' | 'desc';
}

/**
 * Create a new Tag object from raw data
 */
export function createTag(
  id: string,
  name: string,
  content_id: string,
  type_id: string | null = null,
  display_order: number = 0,
  type_name?: string,
  color?: string,
  icon?: string
): Tag {
  return {
    id,
    name,
    content_id,
    type_id,
    display_order,
    type_name,
    color,
    icon
  };
}
