
import { useState, useEffect } from 'react';
import { Tag } from '@/types/tag';

export interface TagGroup {
  category: string;
  tags: Tag[];
}

/**
 * Hook for managing tag groups
 */
export function useTagGroups() {
  const [groups, setGroups] = useState<TagGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Sample function to group tags by type
  const groupTagsByType = (tags: Tag[]): TagGroup[] => {
    const groupMap = new Map<string, Tag[]>();
    
    // Group tags by their type
    tags.forEach(tag => {
      const category = tag.type_name || 'General';
      if (!groupMap.has(category)) {
        groupMap.set(category, []);
      }
      groupMap.get(category)?.push(tag);
    });
    
    // Convert map to array of group objects
    const result: TagGroup[] = [];
    groupMap.forEach((tags, category) => {
      result.push({
        category,
        tags: [...tags]
      });
    });
    
    return result;
  };

  // Function to refresh tag groups
  const refreshGroups = (): boolean => {
    try {
      // This is a placeholder - in a real app, you'd fetch tags from an API
      // and then group them
      setIsLoading(true);
      
      // Example using mock data for demonstration
      const mockTags: Tag[] = [
        { id: '1', name: 'JavaScript', content_id: '1', type_id: '1', display_order: 0, type_name: 'Programming' },
        { id: '2', name: 'TypeScript', content_id: '1', type_id: '1', display_order: 1, type_name: 'Programming' },
        { id: '3', name: 'React', content_id: '1', type_id: '2', display_order: 2, type_name: 'Framework' },
        { id: '4', name: 'Design', content_id: '1', type_id: '3', display_order: 3, type_name: 'Topic' }
      ];
      
      const groupedTags = groupTagsByType(mockTags);
      setGroups(groupedTags);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load tags on mount
  useEffect(() => {
    refreshGroups();
  }, []);

  return {
    groups,
    isLoading,
    error,
    refreshGroups
  };
}

export default useTagGroups;
