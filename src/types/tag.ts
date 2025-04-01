
/**
 * Tag interface
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
  type_name?: string;
}

/**
 * Tag with type information
 */
export interface TagWithType extends Tag {
  type_name: string;
}

/**
 * Tag group interface
 */
export interface TagGroup {
  id: string;
  name: string;
  tags: Tag[];
  content_id: string;
  category?: string;
}

/**
 * Tag count interface
 */
export interface TagCount {
  id: string;
  name: string;
  count: number;
  type_id: string | null;
  type_name?: string | null;
}

/**
 * Tag position interface for reordering operations
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Sort tags by display order
 */
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  if (!tags) return [];
  return [...tags].sort((a, b) => a.display_order - b.display_order);
}

/**
 * Map raw database tag data to Tag interface
 */
export function mapRawTagData(rawTags: any[]): Tag[] {
  if (!rawTags) return [];
  
  return rawTags
    .filter(item => item !== null)
    .map(item => ({
      id: item.id,
      name: item.name,
      content_id: item.content_id,
      type_id: item.type_id,
      display_order: item.display_order || 0,
      type_name: item.type_name
    }));
}

/**
 * Type guard to check if an object is a Tag
 */
export function isTag(obj: any): obj is Tag {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.content_id === 'string' &&
    (obj.type_id === null || typeof obj.type_id === 'string') &&
    typeof obj.display_order === 'number'
  );
}

/**
 * Ensures a value is a Tag or returns null
 */
export function ensureTag(value: any): Tag | null {
  return isTag(value) ? value : null;
}

/**
 * API-specific tag format conversion
 */
export function mapApiTagToTag(apiTag: any): Tag | null {
  if (!apiTag) return null;
  
  return {
    id: apiTag.id || '',
    name: apiTag.name || '',
    content_id: apiTag.content_id || '',
    type_id: apiTag.type_id,
    display_order: apiTag.display_order || 0,
    type_name: apiTag.type_name
  };
}

/**
 * Convert API tags to internal Tag format
 */
export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  if (!apiTags) return [];
  
  return apiTags
    .filter(tag => tag !== null)
    .map(tag => mapApiTagToTag(tag))
    .filter((tag): tag is Tag => tag !== null);
}

/**
 * Safely convert nullable values to non-nullable
 */
export function ensureNonNullableTag(tag: Tag | null): Tag | null {
  if (!tag) return null;
  
  return {
    id: tag.id || '',
    name: tag.name || '',
    content_id: tag.content_id || '',
    type_id: tag.type_id,
    display_order: tag.display_order || 0,
    type_name: tag.type_name
  };
}

/**
 * Filter duplicate tags by name
 */
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  if (!tags) return [];
  
  const uniqueMap = new Map<string, Tag>();
  
  tags.forEach(tag => {
    if (tag && tag.name) {
      const normalizedName = tag.name.toLowerCase().trim();
      if (!uniqueMap.has(normalizedName)) {
        uniqueMap.set(normalizedName, tag);
      }
    }
  });
  
  return Array.from(uniqueMap.values());
}

/**
 * Convert tag positions to tag array
 */
export function convertTagPositionsToTags(positions: TagPosition[], tags: Tag[]): Tag[] {
  if (!positions || !tags) return tags;
  
  const tagMap = new Map(tags.map(tag => [tag.id, tag]));
  const updatedTags = [...tags];
  
  positions.forEach(pos => {
    const tag = tagMap.get(pos.id);
    if (tag) {
      const index = updatedTags.findIndex(t => t.id === pos.id);
      if (index !== -1) {
        updatedTags[index] = { ...tag, display_order: pos.position };
      }
    }
  });
  
  return updatedTags;
}
