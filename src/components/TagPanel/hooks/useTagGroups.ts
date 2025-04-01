
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Tag } from '@/types/tag';

export interface TagGroup {
  category: string;
  tags: Tag[];
}

/**
 * Custom hook for grouping tags by category (type)
 */
export function useTagGroups(tags: Tag[]) {
  const [groups, setGroups] = useState<TagGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Group tags by their type
   */
  const groupTagsByType = useCallback((tagsToGroup: Tag[]): TagGroup[] => {
    // Initialize with Uncategorized group
    const groups: Record<string, TagGroup> = {
      'Uncategorized': {
        category: 'Uncategorized',
        tags: []
      }
    };

    // Group tags by type
    tagsToGroup.forEach(tag => {
      // Safety check for undefined tags
      if (!tag) return;
      
      const typeName = tag.type_name || 'Uncategorized';
      
      if (!groups[typeName]) {
        groups[typeName] = {
          category: typeName,
          tags: []
        };
      }
      
      groups[typeName].tags.push(tag);
    });

    // Convert to array and sort by category name
    return Object.values(groups).sort((a, b) => 
      a.category.localeCompare(b.category)
    );
  }, []);

  /**
   * Refresh groups when tags change
   */
  useEffect(() => {
    setIsLoading(true);
    try {
      const newGroups = groupTagsByType(tags);
      setGroups(newGroups);
      setError(null);
    } catch (err) {
      console.error("Error grouping tags:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [tags, groupTagsByType]);

  /**
   * Refresh groups manually
   */
  const refreshGroups = useCallback(() => {
    try {
      const newGroups = groupTagsByType(tags);
      setGroups(newGroups);
      setError(null);
      return true;
    } catch (err) {
      console.error("Error refreshing tag groups:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  }, [tags, groupTagsByType]);

  return {
    tagGroups: groups,
    isLoading,
    error,
    refreshGroups
  };
}
