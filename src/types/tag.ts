
/**
 * A tag associated with a piece of content
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  display_order?: number;
}

/**
 * Tag position for reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Function to sort tags by their display order
 */
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => {
    const orderA = a.display_order ?? 0;
    const orderB = b.display_order ?? 0;
    return orderA - orderB;
  });
}

/**
 * Filter out duplicate tags based on name
 */
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  const seen = new Set<string>();
  return tags.filter(tag => {
    const normalizedName = tag.name.toLowerCase();
    if (seen.has(normalizedName)) {
      return false;
    }
    seen.add(normalizedName);
    return true;
  });
}

/**
 * Ensures a tag is not null or undefined
 */
export function ensureNonNullableTag(tag: Tag | null | undefined): Tag | null {
  return tag || null;
}

/**
 * Convert tag positions to tags
 */
export function convertTagPositionsToTags(positions: TagPosition[], tags: Tag[]): Tag[] {
  const tagsMap = new Map(tags.map(tag => [tag.id, tag]));
  
  return positions
    .map(pos => {
      const tag = tagsMap.get(pos.id);
      if (tag) {
        return {
          ...tag,
          display_order: pos.position
        };
      }
      return null;
    })
    .filter((tag): tag is Tag => tag !== null);
}

/**
 * Map API tag format to our Tag interface
 */
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id || '',
    name: apiTag.name || '',
    content_id: apiTag.content_id || '',
    type_id: apiTag.type_id || null,
    display_order: typeof apiTag.display_order === 'number' ? apiTag.display_order : 0
  };
}

/**
 * Map array of API tags to our Tag interface
 */
export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  return apiTags.map(mapApiTagToTag);
}

/**
 * Validates if a tag object is valid
 */
export function isValidTag(tag: any): tag is Tag {
  return typeof tag === 'object' && 
    typeof tag.id === 'string' && 
    typeof tag.name === 'string' && 
    typeof tag.content_id === 'string';
}

/**
 * Augmented tag with additional information
 */
export interface AugmentedTag extends Tag {
  type_name?: string;
}
