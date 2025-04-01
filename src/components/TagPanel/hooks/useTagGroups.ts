
import { useMemo } from 'react';
import { Tag } from '@/types/tag';

export interface TagGroup {
  content_id: string;
  id: string;
  name: string;
  tags: Tag[];
}

/**
 * Hook for grouping tags
 */
export function useTagGroups(tags: Tag[]) {
  const groupedTags = useMemo(() => {
    // Group tags by type_id
    const groups: Record<string, Tag[]> = {};
    
    // First, handle tags with no type (default group)
    const defaultGroup = tags.filter(tag => !tag.type_id);
    if (defaultGroup.length > 0) {
      groups['default'] = defaultGroup;
    }
    
    // Then group the rest by type_id
    tags.forEach(tag => {
      if (tag.type_id) {
        if (!groups[tag.type_id]) {
          groups[tag.type_id] = [];
        }
        groups[tag.type_id].push(tag);
      }
    });
    
    // Convert to array of groups
    const result: TagGroup[] = Object.entries(groups).map(([id, tags]) => {
      // Determine content_id from the first tag in the group
      const content_id = tags[0]?.content_id || '';
      
      return {
        id: id === 'default' ? 'default' : id,
        name: id === 'default' ? 'General' : id,
        tags: tags,
        content_id
      };
    });
    
    return result;
  }, [tags]);
  
  return groupedTags;
}

export default useTagGroups;
