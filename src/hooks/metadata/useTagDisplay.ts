
/**
 * Hook for tag display and organization
 * 
 * Provides utilities for organizing and displaying tags, including
 * sorting, filtering, and grouping.
 */
import { useMemo, useState, useEffect } from 'react';
import { Tag, sortTagsByDisplayOrder } from '@/types/tag';

interface UseTagDisplayProps {
  tags: Tag[];
  filter?: string;
  groupByType?: boolean;
}

export function useTagDisplay({
  tags,
  filter = '',
  groupByType = false
}: UseTagDisplayProps = { tags: [] }) {
  const [displayTags, setDisplayTags] = useState<Tag[]>([]);
  
  // Process tags when input changes
  useEffect(() => {
    let processed = [...tags];
    
    // Sort by display order first
    processed = sortTagsByDisplayOrder(processed);
    
    // Apply filter if provided
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      processed = processed.filter(tag => 
        tag.name.toLowerCase().includes(lowerFilter)
      );
    }
    
    setDisplayTags(processed);
  }, [tags, filter]);
  
  // Group tags by type if requested
  const groupedTags = useMemo(() => {
    if (!groupByType) return null;
    
    const groups: Record<string, Tag[]> = {
      'untyped': []
    };
    
    // Group by type_id
    displayTags.forEach(tag => {
      const typeId = tag.type_id || 'untyped';
      const typeName = tag.type_name || 'Untyped';
      
      if (!groups[typeId]) {
        groups[typeId] = [];
      }
      
      groups[typeId].push(tag);
    });
    
    // Convert to array format for easier rendering
    return Object.entries(groups).map(([typeId, tags]) => ({
      typeId,
      typeName: tags[0]?.type_name || 'Untyped',
      tags
    }));
  }, [displayTags, groupByType]);
  
  return {
    tags: displayTags,
    groupedTags,
    hasUnfilteredTags: tags.length > 0,
    hasTags: displayTags.length > 0
  };
}

export default useTagDisplay;
