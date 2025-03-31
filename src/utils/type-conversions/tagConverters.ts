
import { Tag, TagPosition } from '@/types/tag';

/**
 * Utility functions for converting between different tag representations
 */

/**
 * Convert a tag from API format to the standard Tag interface
 */
export function apiTagToStandardTag(apiTag: any): Tag {
  // Handle null/undefined cases
  if (!apiTag) {
    return {
      id: '',
      name: '',
      content_id: '',
      type_id: null,
      display_order: 0
    };
  }

  return {
    id: typeof apiTag.id === 'string' ? apiTag.id : '',
    name: typeof apiTag.name === 'string' ? apiTag.name : '',
    content_id: typeof apiTag.content_id === 'string' ? apiTag.content_id : '',
    type_id: typeof apiTag.type_id === 'string' ? apiTag.type_id : null,
    type_name: apiTag.tag_types && typeof apiTag.tag_types.name === 'string' 
      ? apiTag.tag_types.name 
      : null,
    display_order: typeof apiTag.display_order === 'number' ? apiTag.display_order : 0
  };
}

/**
 * Convert a string-only tag to the standard Tag interface
 */
export function stringToStandardTag(tagName: string, contentId?: string): Tag {
  return {
    id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: tagName.trim(),
    content_id: contentId || '',
    type_id: null,
    display_order: 0
  };
}

/**
 * Convert a legacy tag format to the standard Tag interface
 */
export function legacyTagToStandardTag(legacyTag: any): Tag {
  if (!legacyTag) {
    return {
      id: '',
      name: '',
      content_id: '',
      type_id: null,
      display_order: 0
    };
  }

  return {
    id: typeof legacyTag.id === 'string' ? legacyTag.id : '',
    name: typeof legacyTag.name === 'string' ? legacyTag.name : '',
    content_id: typeof legacyTag.content_id === 'string' ? legacyTag.content_id : '',
    type_id: typeof legacyTag.type_id === 'string' ? legacyTag.type_id : null,
    type_name: typeof legacyTag.type_name === 'string' ? legacyTag.type_name : null,
    display_order: typeof legacyTag.display_order === 'number' ? legacyTag.display_order : 0
  };
}

/**
 * Convert tag positions to tags
 */
export function tagPositionsToTags(positions: TagPosition[], allTags: Tag[]): Tag[] {
  // Create a mapping of tag IDs to tags
  const tagMap = new Map<string, Tag>();
  allTags.forEach(tag => tagMap.set(tag.id, tag));
  
  // Convert positions to ordered tags
  return positions
    .sort((a, b) => a.position - b.position)
    .map(pos => tagMap.get(pos.id))
    .filter((tag): tag is Tag => tag !== undefined);
}
