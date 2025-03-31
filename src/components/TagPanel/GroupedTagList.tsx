
import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Tag } from '@/components/MetadataPanel/hooks/tag-operations/types';
import { TagCard } from './TagCard';
import { safeCallback } from '@/utils/compatibility';

/**
 * Interface representing a mapping of tag types to tag names
 */
interface TagGroup {
  [key: string]: string[];
}

/**
 * Structure for categorized tags
 */
interface TagsByType {
  typedTags: TagGroup;
  uncategorized: string[];
}

/**
 * Props for the GroupedTagList component
 */
interface GroupedTagListProps {
  tags: Tag[];
  isLoading?: boolean;
  onTagClick?: (tag: string) => void; 
  refreshTrigger?: number;
}

/**
 * GroupedTagList Component
 * 
 * Displays tags organized by their types, with a separate section for uncategorized tags.
 * Provides loading states and empty states.
 * 
 * @param tags - Array of Tag objects to display
 * @param isLoading - Whether tags are currently loading
 * @param onTagClick - Optional callback for when a tag is clicked
 * @param refreshTrigger - A number that triggers re-grouping when changed
 */
export function GroupedTagList({ 
  tags, 
  isLoading = false,
  onTagClick,
  refreshTrigger = 0 
}: GroupedTagListProps) {
  // Group tags by type - memoize to avoid recomputing on every render
  const groupedTags = useMemo(() => {
    if (!tags || tags.length === 0) {
      return {
        typedTags: {},
        uncategorized: []
      };
    }
    
    // Create a safe callback for tag clicks
    const safeTagClickHandler = safeCallback(onTagClick, () => {});
    
    // Group tags by their type_id
    return tags.reduce<TagsByType>(
      (result, tag) => {
        const tagName = tag.name;
        
        // If the tag has a type ID and it's not blank
        if (tag.type_id) {
          // Get the type name if available, otherwise use the type ID
          const typeName = tag.type_name || tag.type_id;
          
          // Initialize the array for this type if it doesn't exist
          if (!result.typedTags[typeName]) {
            result.typedTags[typeName] = [];
          }
          
          // Add the tag to its type group
          result.typedTags[typeName].push(tagName);
        } else {
          // Tag has no type, add to uncategorized
          result.uncategorized.push(tagName);
        }
        
        return result;
      },
      { typedTags: {}, uncategorized: [] }
    );
  }, [tags, refreshTrigger, onTagClick]);
  
  // Handle click on a tag
  const handleTagClick = useMemo(() => {
    return safeCallback(onTagClick, () => {});
  }, [onTagClick]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    );
  }

  if (!tags || tags.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        No tags available.
      </div>
    );
  }

  // Render the grouped tags
  return (
    <div className="space-y-4">
      {/* Render typed tags first, grouped by type */}
      {Object.keys(groupedTags.typedTags).map((typeKey) => (
        <TagCard
          key={typeKey}
          title={typeKey}
          tags={groupedTags.typedTags[typeKey] || []} 
          onTagClick={handleTagClick}
        />
      ))}
      
      {/* Render uncategorized tags last, if any */}
      {groupedTags.uncategorized && groupedTags.uncategorized.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">General</h3>
          <div className="flex flex-wrap gap-1">
            {groupedTags.uncategorized.map((tagName) => (
              <Badge
                key={tagName}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => handleTagClick(tagName)}
              >
                {tagName}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
