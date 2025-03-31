
/**
 * Tag Utility Functions
 * 
 * This file provides utilities for working with tag data throughout the application,
 * ensuring consistent transformation and handling of tags from various sources.
 */

import { Tag, filterDuplicateTags } from '@/types/tag';

/**
 * Transforms tag data from various formats into a standard Tag object
 * 
 * This function handles different input formats and normalizes them into
 * a consistent Tag object format for use throughout the application.
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
      type_id: null,
      display_order: 0
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
      type_name: tagData.type_name || null,
      display_order: typeof tagData.display_order === 'number' ? tagData.display_order : 0
    };
  }
  
  // Fallback for unexpected input
  return {
    id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: String(tagData).trim().toLowerCase(),
    content_id: '',
    type_id: null,
    display_order: 0
  };
}

/**
 * Filters out duplicate tags from an array based on name
 * @deprecated Use filterDuplicateTags from @/types/tag instead
 */
export { filterDuplicateTags };

/**
 * Sorts tags by their display_order field
 * 
 * @param tags Array of tags to sort
 * @returns Sorted array of tags
 */
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  if (!tags || !Array.isArray(tags)) return [];
  
  return [...tags].sort((a, b) => {
    // Primary sort by display_order
    const orderDiff = (a.display_order || 0) - (b.display_order || 0);
    if (orderDiff !== 0) return orderDiff;
    
    // Secondary sort by name for consistent ordering when display_order is the same
    return a.name.localeCompare(b.name);
  });
}

/**
 * Generates updated display order values for an array of tags
 * 
 * @param tags Array of tags to update
 * @returns Tags with sequential display_order values
 */
export function generateDisplayOrder(tags: Tag[]): Tag[] {
  if (!tags || !Array.isArray(tags)) return [];
  
  return tags.map((tag, index) => ({
    ...tag,
    display_order: index
  }));
}
