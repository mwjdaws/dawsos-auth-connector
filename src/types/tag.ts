
/**
 * Tag Types
 * 
 * This file defines the types for tags and tag operations
 */

// Base Tag interface
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
  type_name: string;
}

// Tag data without an ID (for creation)
export interface TagData {
  name: string;
  content_id: string;
  type_id?: string | null;
  display_order?: number;
}

// Tag group - for grouping tags by type
export interface TagGroup {
  type_id: string | null;
  type_name: string | null;
  tags: Tag[];
  content_id: string;
}

// Tag type
export interface TagType {
  id: string;
  name: string;
  description?: string;
  order?: number;
}

// Tag operation results
export interface TagOperationResult {
  success: boolean;
  tag?: Tag;
  error?: string;
}

// Request to update the position of a tag
export interface UpdateTagPositionRequest {
  tagId: string;
  newPosition: number;
}

// Functions to create new tag objects

/**
 * Creates a new Tag object from raw data
 */
export function createTag(
  id: string,
  name: string,
  content_id: string,
  type_id: string | null,
  display_order: number,
  type_name: string = ''
): Tag {
  return {
    id,
    name,
    content_id,
    type_id,
    display_order,
    type_name
  };
}

/**
 * Creates a new TagData object
 */
export function createTagData(
  name: string,
  content_id: string,
  type_id?: string | null,
  display_order?: number
): TagData {
  return {
    name,
    content_id,
    type_id,
    display_order
  };
}

/**
 * Create a TagGroup object
 */
export function createTagGroup(
  type_id: string | null,
  type_name: string | null,
  tags: Tag[],
  content_id: string
): TagGroup {
  return {
    type_id,
    type_name,
    tags,
    content_id
  };
}

/**
 * Creates a successful operation result
 */
export function createSuccessResult(tag: Tag): TagOperationResult {
  return {
    success: true,
    tag
  };
}

/**
 * Creates a failed operation result
 */
export function createErrorResult(error: string): TagOperationResult {
  return {
    success: false,
    error
  };
}
