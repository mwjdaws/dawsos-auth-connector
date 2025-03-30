
import { Tag } from '@/components/MetadataPanel/hooks/tag-operations/types';

/**
 * Transforms tag data from various formats into a standard Tag object
 * 
 * @param tagData Raw tag data in various potential formats
 * @returns Standardized Tag object
 */
export function transformTagData(tagData: any): Tag {
  // Handle string input (just the tag name)
  if (typeof tagData === 'string') {
    return {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: tagData.trim().toLowerCase(),
      content_id: undefined
    };
  }
  
  // Handle object input
  if (typeof tagData === 'object' && tagData !== null) {
    // Ensure name exists and is a string
    const name = typeof tagData.name === 'string' 
      ? tagData.name.trim().toLowerCase() 
      : (tagData.tag || '').toString().trim().toLowerCase();
    
    return {
      id: tagData.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      content_id: tagData.content_id,
      type_id: tagData.type_id,
      type_name: tagData.type_name
    };
  }
  
  // Fallback for unexpected input
  return {
    id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: String(tagData).trim().toLowerCase(),
    content_id: undefined
  };
}

/**
 * Filters out duplicate tags from an array based on name
 * 
 * @param tags Array of tags to filter
 * @returns Array of unique tags (based on name)
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
