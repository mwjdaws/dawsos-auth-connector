
import { Tag, TagPosition, mapApiTagToTag, ensureNonNullableTag, convertTagPositionsToTags, mapApiTagsToTags } from "@/types/tag";

/**
 * API compatibility layer for tag operations
 */

/**
 * Convert API tag format to internal Tag format
 * @deprecated Use mapApiTagToTag from @/types/tag instead
 */
export { mapApiTagToTag };

/**
 * Convert API tags to internal Tag format
 * @deprecated Use mapApiTagsToTags from @/types/tag instead
 */
export { mapApiTagsToTags };

/**
 * Safely convert nullable values to non-nullable
 * @deprecated Use ensureNonNullableTag from @/types/tag instead
 */
export { ensureNonNullableTag };

/**
 * Convert tag positions to tag array
 * @deprecated Use convertTagPositionsToTags from @/types/tag instead
 */
export { convertTagPositionsToTags };
