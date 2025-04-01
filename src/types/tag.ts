
/**
 * Tag data types
 */

// Basic tag structure
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  display_order: number;
  type_name?: string;
  color?: string;
  icon?: string;
}

// Tag with additional display information
export interface TagWithTypeInfo extends Tag {
  type_name?: string;
  color?: string;
  icon?: string;
}

// Tag group structure
export interface TagGroup {
  content_id: string;
  type: string;
  tags: Tag[];
  color?: string;
  icon?: string;
  name?: string;
  category?: string;
}

// Tag data from API
export interface TagData {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
}

// Tag display options
export interface TagDisplay {
  showCount?: boolean;
  clickable?: boolean;
  showDelete?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'secondary' | 'outline';
}

// Tag position for reordering
export interface TagPosition {
  id: string;
  position: number;
}

// Utility functions
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id || '',
    name: apiTag.name || '',
    content_id: apiTag.content_id || '',
    type_id: apiTag.type_id || null,
    display_order: typeof apiTag.display_order === 'number' ? apiTag.display_order : 0,
    type_name: apiTag.type_name || undefined,
    color: apiTag.color || undefined,
    icon: apiTag.icon || undefined,
  };
}

export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  return Array.isArray(apiTags) ? apiTags.map(mapApiTagToTag) : [];
}

export function ensureNonNullableTag(tag: Tag | null | undefined): Tag | null {
  if (!tag) return null;
  return {
    id: tag.id || '',
    name: tag.name || '',
    content_id: tag.content_id || '',
    type_id: tag.type_id || null,
    display_order: typeof tag.display_order === 'number' ? tag.display_order : 0,
    type_name: tag.type_name || undefined,
    color: tag.color || undefined,
    icon: tag.icon || undefined,
  };
}

// Filter duplicate tags based on ID
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  const uniqueTags = new Map<string, Tag>();
  
  tags.forEach(tag => {
    if (!uniqueTags.has(tag.id)) {
      uniqueTags.set(tag.id, tag);
    }
  });
  
  return Array.from(uniqueTags.values());
}

// Convert position objects to tag objects
export function convertTagPositionsToTags(positions: TagPosition[], tags: Tag[]): Tag[] {
  const tagMap = new Map<string, Tag>();
  
  // Create a map of tags by ID
  tags.forEach(tag => tagMap.set(tag.id, tag));
  
  // Create new tags with updated positions
  return positions
    .map((pos, index) => {
      const tag = tagMap.get(pos.id);
      
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

// Sort tags by display order
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => {
    const orderA = typeof a.display_order === 'number' ? a.display_order : 0;
    const orderB = typeof b.display_order === 'number' ? b.display_order : 0;
    return orderA - orderB;
  });
}
