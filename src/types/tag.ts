
/**
 * Type definitions for tags
 */

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  type_name?: string; // Make this optional for backward compatibility
  display_order: number;
}

export interface TagData {
  id?: string;
  name: string;
  content_id: string;
  type_id?: string | null;
}

export interface TagDisplay {
  id: string;
  name: string;
  type?: string;
  color?: string;
}

export interface TagGroup {
  id: string;
  name: string;
  content_id: string;
  category?: string; // Make category optional
  tags: Tag[];
}

export interface TagPosition {
  id: string;
  position: number;
}

// Utility functions for tag operations
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id,
    name: apiTag.name,
    content_id: apiTag.content_id,
    type_id: apiTag.type_id,
    type_name: apiTag.type_name || null,
    display_order: apiTag.display_order || 0
  };
}

export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  return apiTags.map(mapApiTagToTag);
}

export function ensureNonNullableTag(tag: Tag | null | undefined): Tag {
  if (!tag) {
    return {
      id: '',
      name: '',
      content_id: '',
      type_id: null,
      type_name: undefined,
      display_order: 0
    };
  }
  return tag;
}

export function filterDuplicateTags(tags: Tag[]): Tag[] {
  const uniqueIds = new Set<string>();
  return tags.filter(tag => {
    if (uniqueIds.has(tag.id)) {
      return false;
    }
    uniqueIds.add(tag.id);
    return true;
  });
}

export function convertTagPositionsToTags(positions: TagPosition[], allTags: Tag[]): Tag[] {
  return positions
    .map(position => {
      const tag = allTags.find(t => t.id === position.id);
      if (tag) {
        return {
          ...tag,
          display_order: position.position
        };
      }
      return null;
    })
    .filter((tag): tag is Tag => tag !== null);
}
