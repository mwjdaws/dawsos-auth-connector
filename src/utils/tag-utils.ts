import { Tag } from '@/types/tag';

/**
 * Sort tags by display order
 */
export function sortTagsByDisplayOrder(tags: any[]): any[] {
  return [...tags].sort((a, b) => {
    // Default to 0 if display_order is not defined
    const orderA = a.display_order || 0;
    const orderB = b.display_order || 0;
    return orderA - orderB;
  });
}

/**
 * Group tags by their type
 */
export const groupTagsByType = (tags: Tag[]): Record<string, Tag[]> => {
  const groupedTags: Record<string, Tag[]> = {};
  
  tags.forEach(tag => {
    const typeName = tag.type_name || 'Unclassified';
    if (!groupedTags[typeName]) {
      groupedTags[typeName] = [];
    }
    groupedTags[typeName].push(tag);
  });
  
  // Sort each group by display order
  Object.keys(groupedTags).forEach(typeName => {
    groupedTags[typeName] = sortTagsByDisplayOrder(groupedTags[typeName]);
  });
  
  return groupedTags;
};

/**
 * Return a filtered list of tags by type name
 */
export const filterTagsByType = (tags: Tag[], typeName: string): Tag[] => {
  return tags.filter(tag => tag.type_name === typeName || 
    (!tag.type_name && typeName === 'Unclassified'));
};

/**
 * Returns a list of unique tag types from a tag array
 */
export const getUniqueTagTypes = (tags: Tag[]): string[] => {
  const types = new Set<string>();
  
  tags.forEach(tag => {
    types.add(tag.type_name || 'Unclassified');
  });
  
  return Array.from(types).sort();
};
