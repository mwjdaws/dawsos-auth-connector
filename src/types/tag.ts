
/**
 * Tag Types
 */

/**
 * Tag interface representing a tag associated with content
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
  type_name: string | null;
  color?: string | null;
  icon?: string | null;
}

/**
 * Tag type for API operations
 */
export interface TagDto {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
}

/**
 * Group of tags with the same type
 */
export interface TagGroup {
  typeName: string | null;
  typeId: string | null;
  tags: Tag[];
  color?: string | null; 
  icon?: string | null;
}

/**
 * Type for tag creation payloads
 */
export interface CreateTagPayload {
  name: string;
  content_id: string;
  type_id?: string | null;
}

/**
 * Type for tag deletion payloads
 */
export interface DeleteTagPayload {
  tagId: string;
  contentId: string;
}

/**
 * Type for tag position in reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Type for grouped tag display
 */
export interface TagDisplay {
  name: string;
  id: string;
  typeId: string | null;
  typeName?: string | null;
  color?: string | null;
  icon?: string | null;
}

/**
 * Result of a tag operation
 */
export interface TagOperationResult {
  success: boolean;
  tag?: Tag | null;
  error?: string | null;
}

/**
 * Convert from API tag model to frontend Tag model
 */
export function convertApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id,
    name: apiTag.name,
    content_id: apiTag.content_id,
    type_id: apiTag.type_id,
    display_order: apiTag.display_order || 0,
    type_name: apiTag.type_name || null,
    color: apiTag.color || null,
    icon: apiTag.icon || null
  };
}

/**
 * Convert a tag to a display tag for UI rendering
 */
export function convertTagToTagDisplay(tag: Tag): TagDisplay {
  return {
    id: tag.id,
    name: tag.name,
    typeId: tag.type_id,
    typeName: tag.type_name || null,
    color: tag.color || null,
    icon: tag.icon || null
  };
}
