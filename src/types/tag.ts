
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
      display_order: item.display_order,
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
