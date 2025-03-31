
/**
 * Core Tag type definition
 * 
 * This is the centralized definition of a Tag used throughout the application.
 * All components and hooks should import this type rather than defining their own.
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  type_name?: string | null;
}

/**
 * Extended Tag interface for AI-generated tags
 * 
 * Adds additional properties for AI-generated tags to support
 * confidence scoring, provenance tracking, and explanations.
 */
export interface AugmentedTag extends Tag {
  confidence: number;       // 0-1 score of how confident the AI is
  source: 'manual' | 'ai' | 'hybrid'; // Provenance
  explanation?: string | null;     // Why this tag was suggested
  alternatives?: string[] | null;  // Other potential tag options
  context?: string | null;         // Text snippet that triggered this tag
}

/**
 * Tag position for ordering tags
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Utility function to map API tag data to the standard Tag interface
 */
export function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: typeof apiTag.id === 'string' ? apiTag.id : '',
    name: typeof apiTag.name === 'string' ? apiTag.name : '',
    content_id: typeof apiTag.content_id === 'string' ? apiTag.content_id : '',
    type_id: typeof apiTag.type_id === 'string' ? apiTag.type_id : null,
    type_name: apiTag.tag_types && typeof apiTag.tag_types.name === 'string' 
      ? apiTag.tag_types.name 
      : null
  };
}

/**
 * Utility function to map API tags to internal Tag format
 */
export function mapApiTagsToTags(apiTags: any[]): Tag[] {
  return Array.isArray(apiTags) ? apiTags.map(mapApiTagToTag) : [];
}

/**
 * Safely convert nullable values to non-nullable in a tag
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
    type_id: tag.type_id,
    type_name: null
  };
}

/**
 * Filter out duplicate tags from an array based on name
 */
export function filterDuplicateTags(tags: Tag[]): Tag[] {
  const seen = new Set<string>();
  return tags.filter(tag => {
    const normalizedName = tag.name.trim().toLowerCase();
    if (seen.has(normalizedName)) {
      return false;
    }
    seen.add(normalizedName);
    return true;
  });
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

/**
 * Check if a value is a valid Tag object
 */
export function isValidTag(tag: any): tag is Tag {
  return (
    tag &&
    typeof tag === 'object' &&
    typeof tag.id === 'string' &&
    typeof tag.name === 'string' &&
    typeof tag.content_id === 'string'
  );
}
