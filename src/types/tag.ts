
/**
 * Represents a tag associated with a content item
 */
export interface Tag {
  /**
   * Unique identifier for the tag
   */
  id: string;
  
  /**
   * Display name of the tag
   */
  name: string;
  
  /**
   * ID of the content the tag is associated with
   */
  content_id: string;
  
  /**
   * ID of the tag type, if any
   */
  type_id: string | null;
  
  /**
   * Name of the tag type, if any (for display purposes)
   */
  type_name: string | null;
  
  /**
   * The display order for this tag
   */
  display_order: number;
}

/**
 * Position information for tag reordering
 */
export interface TagPosition {
  /**
   * ID of the tag
   */
  id: string;
  
  /**
   * New position of the tag
   */
  position: number;
}

/**
 * Tag grouped by type
 */
export interface TagGroup {
  /**
   * ID of the type, if any
   */
  type_id: string | null;
  
  /**
   * Name of the type, if any
   */
  type_name: string | null;
  
  /**
   * Tags in this group
   */
  tags: Tag[];
}

/**
 * Data required for creating a new tag
 */
export interface CreateTagData {
  /**
   * Name of the new tag
   */
  name: string;
  
  /**
   * ID of the content to associate with
   */
  contentId: string;
  
  /**
   * Optional tag type ID
   */
  typeId?: string | null;
}

/**
 * Data required for deleting a tag
 */
export interface DeleteTagData {
  /**
   * ID of the tag to delete
   */
  tagId: string;
  
  /**
   * ID of the associated content
   */
  contentId: string;
}
