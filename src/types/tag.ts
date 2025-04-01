
/**
 * Tag types and utilities
 */

/**
 * Core Tag interface
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
  type_name: string; // Required field to fix type errors
}

/**
 * API Tag interface (from database)
 */
export interface ApiTag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
}

/**
 * Tag for display
 */
export interface TagDisplay extends Tag {
  color?: string;
  category?: string;
}

/**
 * Input for creating a new tag
 */
export interface TagData {
  name: string;
  content_id: string;
  type_id: string | null;
  display_order?: number;
}

/**
 * Tag group for categorized display
 */
export interface TagGroup {
  id: string;
  name: string;
  tags: Tag[];
  content_id: string;
  category: string; // Added to fix errors
}

/**
 * Position information for tag reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Type for tag validation results
 */
export interface TagValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Maps API tag format to our internal format
 */
export function mapApiTagToTag(apiTag: ApiTag | null): Tag | null {
  if (!apiTag) return null;
  
  return {
    id: apiTag.id,
    name: apiTag.name,
    content_id: apiTag.content_id,
    type_id: apiTag.type_id,
    display_order: apiTag.display_order,
    type_name: '' // Default empty string for type_name
  };
}

/**
 * Maps array of API tags to internal format
 */
export function mapApiTagsToTags(apiTags: ApiTag[] | null): Tag[] {
  if (!apiTags) return [];
  
  return apiTags.map(tag => ({
    id: tag.id,
    name: tag.name,
    content_id: tag.content_id,
    type_id: tag.type_id,
    display_order: tag.display_order,
    type_name: '' // Default empty string for type_name
  }));
}

/**
 * Ensures a tag is not null
 */
export function ensureNonNullableTag(tag: Tag | null): Tag {
  if (!tag) {
    return {
      id: '',
      name: '',
      content_id: '',
      type_id: null,
      display_order: 0,
      type_name: ''
    };
  }
  return tag;
}

/**
 * Filters out duplicate tags by name
 */
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  const uniqueTags = new Map<string, Tag>();
  
  tags.forEach(tag => {
    if (!uniqueTags.has(tag.name.toLowerCase())) {
      uniqueTags.set(tag.name.toLowerCase(), tag);
    }
  });
  
  return Array.from(uniqueTags.values());
}

/**
 * Converts tag positions to tags
 */
export function convertTagPositionsToTags(
  positions: TagPosition[],
  existingTags: Tag[]
): Tag[] {
  return positions.map(position => {
    const existingTag = existingTags.find(tag => tag.id === position.id);
    if (!existingTag) {
      throw new Error(`Tag with id ${position.id} not found`);
    }
    
    return {
      ...existingTag,
      display_order: position.position
    };
  });
}

/**
 * Sorts tags by display order
 */
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => a.display_order - b.display_order);
}
