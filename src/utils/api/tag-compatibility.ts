
import { Tag, TagPosition, TagGroup, CreateTagData, DeleteTagData } from "@/types/tag";

/**
 * API compatibility layer for tag operations
 */

/**
 * Convert API tag format to internal Tag format
 * @deprecated Use mapApiTagToTag from @/types/tag instead
 */
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: apiTag.id || '',
    name: apiTag.name || '',
    content_id: apiTag.content_id || apiTag.contentId || '',
    type_id: apiTag.type_id ?? apiTag.typeId ?? null,
    type_name: apiTag.type_name ?? apiTag.typeName ?? null,
    display_order: apiTag.display_order ?? apiTag.displayOrder ?? 0,
    color: apiTag.color ?? undefined
  };
}

/**
 * Convert API tags to internal Tag format
 * @deprecated Use mapApiTagsToTags from @/types/tag instead
 */
export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  if (!Array.isArray(apiTags)) return [];
  return apiTags.map(mapApiTagToTag);
}

/**
 * Safely convert nullable values to non-nullable
 * @deprecated Use ensureNonNullableTag from @/types/tag instead
 */
export function ensureNonNullableTag(tag: Tag | null | undefined): Tag {
  if (!tag) {
    return {
      id: '',
      name: '',
      content_id: '',
      type_id: null,
      type_name: null,
      display_order: 0
    };
  }
  return tag;
}

/**
 * Convert tag positions to tag array
 * @deprecated Use convertTagPositionsToTags from @/types/tag instead
 */
export function convertTagPositionsToTags(positions: TagPosition[], existingTags: Tag[]): Tag[] {
  return positions.map(pos => {
    const tag = existingTags.find(t => t.id === pos.id);
    if (!tag) {
      return {
        id: pos.id,
        name: '',
        content_id: '',
        type_id: null,
        type_name: null,
        display_order: pos.position
      };
    }
    return {
      ...tag,
      display_order: pos.position
    };
  });
}
