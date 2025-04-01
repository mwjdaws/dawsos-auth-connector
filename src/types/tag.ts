
/**
 * Type definitions for tag-related entities
 */

// Basic tag interface
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
  type_name: string | null; // Name of the tag type
}

// Type for tag positions used in reordering
export interface TagPosition {
  id: string;
  displayOrder: number;
  name: string;
  typeId: string | null;
}

// Type for tag groups
export interface TagGroup {
  type_id: string | null;
  type_name: string | null;
  tags: Tag[];
}

// Tag with optional additional data
export interface EnrichedTag extends Tag {
  type_name: string | null;
  metadata?: Record<string, any>;
}

// Tag creation request
export interface TagCreationRequest {
  name: string;
  contentId: string;
  typeId?: string | null;
}

// Tag deletion request
export interface TagDeletionRequest {
  tagId: string;
  contentId: string;
}

/**
 * Converts data from API to Tag interface
 */
export function toTag(data: any): Tag | null {
  if (!data) return null;
  
  return {
    id: data.id,
    name: data.name,
    content_id: data.content_id,
    type_id: data.type_id,
    display_order: data.display_order || 0,
    type_name: data.type_name || null
  };
}

/**
 * Converts array of tag data from API to Tag[] array
 */
export function toTags(data: any[]): Tag[] {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => toTag(item)).filter((tag): tag is Tag => tag !== null);
}
