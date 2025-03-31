
import React, { useMemo } from 'react';
import { TagGroup } from './hooks/useTagGroups';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from 'lucide-react';
import { useTagReordering } from '@/hooks/metadata/useTagReordering';
import { TagPosition } from '@/utils/validation/types';

interface GroupedTagListProps {
  tagGroups: TagGroup[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagDeselect: (tag: string) => void;
  isReadOnly?: boolean;
  showCounts?: boolean;
  className?: string;
}

export function GroupedTagList({
  tagGroups,
  selectedTags,
  onTagSelect,
  onTagDeselect,
  isReadOnly = false,
  showCounts = true,
  className = ''
}: GroupedTagListProps) {
  // Memoize processed groups to avoid recalculation on each render
  const processedGroups = useMemo(() => {
    // Create a map to track total tags and selection counts for each category
    const groupCountsMap: Record<string, { total: number; selected: number }> = {};
    
    // Initialize group counts
    tagGroups.forEach(group => {
      if (group.category) {
        groupCountsMap[group.category] = { total: 0, selected: 0 };
      }
    });
    
    // Calculate counts
    tagGroups.forEach(group => {
      if (group.category && group.tags && group.tags.length > 0) {
        const categoryStats = groupCountsMap[group.category];
        if (categoryStats) {
          categoryStats.total += group.tags.length;
          categoryStats.selected += group.tags.filter(tag => selectedTags.includes(tag)).length;
        }
      }
    });
    
    return {
      groups: tagGroups,
      counts: groupCountsMap
    };
  }, [tagGroups, selectedTags]);
  
  // Group tags by categories for rendering
  const categorizedGroups = useMemo(() => {
    const categories: Record<string, TagGroup[]> = {};
    
    processedGroups.groups.forEach(group => {
      const category = group.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(group);
    });
    
    return categories;
  }, [processedGroups.groups]);
  
  const handleTagClick = (tag: string) => {
    if (isReadOnly) return;
    
    if (selectedTags.includes(tag)) {
      onTagDeselect(tag);
    } else {
      onTagSelect(tag);
    }
  };
  
  // Render the tag groups by category
  return (
    <div className={`space-y-4 ${className}`}>
      {Object.keys(categorizedGroups).map(category => {
        // Safely access the counts for this category (if they exist)
        const categoryStats = processedGroups.counts[category] || { total: 0, selected: 0 };
        
        return (
          <div key={category} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                {category}
              </h3>
              {showCounts && (
                <span className="text-xs text-gray-500">
                  {categoryStats.selected}/{categoryStats.total} selected
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categorizedGroups[category].flatMap(group => 
                group.tags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  
                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? "default" : "outline"}
                      className={`
                        px-2 py-1 cursor-pointer transition-colors
                        ${isSelected ? 'bg-primary hover:bg-primary/90' : 'hover:bg-muted/50'}
                        ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}
                      `}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                      {isSelected && (
                        <CheckCircle className="ml-1 h-3 w-3 text-primary-foreground" />
                      )}
                    </Badge>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GroupedTagList;
