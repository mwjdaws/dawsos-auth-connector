
/**
 * Tag utility functions for working with tags
 */
import { Tag, TagGroup } from '@/types/tag';

/**
 * Group tags by their type_name
 */
export const groupTagsByType = (tags: Tag[]): TagGroup[] => {
  const groupMap = new Map<string, TagGroup>();
  
  // First, handle tags with type_name
  tags.forEach(tag => {
    const typeName = tag.type_name || 'Uncategorized';
    const typeId = tag.type_id;
    
    if (!groupMap.has(typeName)) {
      groupMap.set(typeName, {
        name: typeName,
        type_id: typeId,
        tags: []
      });
    }
    
    groupMap.get(typeName)?.tags.push(tag);
  });
  
  // Sort groups by name
  return Array.from(groupMap.values()).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
};

/**
 * Group tags by their category
 */
export const groupTagsByCategory = (tags: Tag[]): TagGroup[] => {
  const groupMap = new Map<string, TagGroup>();
  
  tags.forEach(tag => {
    const category = tag.category || 'Uncategorized';
    
    if (!groupMap.has(category)) {
      groupMap.set(category, {
        name: category,
        type_id: null,
        tags: []
      });
    }
    
    groupMap.get(category)?.tags.push(tag);
  });
  
  // Sort groups by name
  return Array.from(groupMap.values()).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
};

/**
 * Find a tag by ID in a list of tags
 */
export const findTagById = (tagId: string, tags: Tag[]): Tag | undefined => {
  return tags.find(tag => tag.id === tagId);
};

/**
 * Check if a tag with the same name already exists
 */
export const isDuplicateTag = (name: string, existingTags: Tag[]): boolean => {
  const normalizedName = name.trim().toLowerCase();
  return existingTags.some(tag => tag.name.trim().toLowerCase() === normalizedName);
};

/**
 * Get a suggested display order for a new tag
 */
export const getNextDisplayOrder = (tags: Tag[]): number => {
  if (tags.length === 0) return 0;
  const maxOrder = Math.max(...tags.map(tag => tag.display_order));
  return maxOrder + 1;
};
