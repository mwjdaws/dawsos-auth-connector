
import { Tag, TagPosition } from "@/types/tag";

/**
 * API compatibility layer for tag operations
 */

/**
 * Convert API tag format to internal Tag format
 */
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id || '',
    name: apiTag.name || '',
    content_id: apiTag.content_id || '',
    type_id: apiTag.type_id || undefined,
    type_name: apiTag.tag_types?.name || undefined
  };
}

/**
 * Convert API tags to internal Tag format
 */
export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  return apiTags.map(mapApiTagToTag);
}

/**
 * Safely convert nullable values to non-nullable
 */
export function ensureNonNullableTag(tag: {
  content_id: string | null;
  id: string;
  name: string;
  type_id: string | null;
}): Tag {
  return {
    id: tag.id,
    name: tag.name,
    content_id: tag.content_id || '',
    type_id: tag.type_id || undefined,
    type_name: undefined
  };
}

/**
 * Convert tag positions to tag array
 */
export function convertTagPositionsToTags(positions: TagPosition[], allTags: Tag[]): Tag[] {
  // Create a mapping of tag IDs to tags
  const tagMap = new Map<string, Tag>();
  allTags.forEach(tag => tagMap.set(tag.id, tag));
  
  // Convert positions to ordered tags
  return positions
    .sort((a, b) => a.position - b.position)
    .map(pos => tagMap.get(pos.id))
    .filter((tag): tag is Tag => tag !== undefined);
}
