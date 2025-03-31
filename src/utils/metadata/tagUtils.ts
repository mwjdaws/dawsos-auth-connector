
import { Tag, filterDuplicateTags } from '@/types/tag';

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
      content_id: '',
      type_id: null
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
      content_id: tagData.content_id || '',
      type_id: tagData.type_id || null,
      type_name: tagData.type_name || null
    };
  }
  
  // Fallback for unexpected input
  return {
    id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: String(tagData).trim().toLowerCase(),
    content_id: '',
    type_id: null
  };
}

/**
 * Filters out duplicate tags from an array based on name
 * @deprecated Use filterDuplicateTags from @/types/tag instead
 */
export { filterDuplicateTags };
