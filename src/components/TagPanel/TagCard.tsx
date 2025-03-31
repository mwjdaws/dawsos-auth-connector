
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TagCardProps {
  title: string;
  tags: string[];
  onTagClick: (tag: string) => void;
}

/**
 * TagCard component
 * 
 * Displays a group of tags with a title header.
 * Used by the GroupedTagList to render tag categories.
 * 
 * @param title - The title for this group of tags
 * @param tags - Array of tag strings to display
 * @param onTagClick - Callback function when a tag is clicked
 */
export function TagCard({ title, tags, onTagClick }: TagCardProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="flex flex-wrap gap-1">
        {tags.map((tagName) => (
          <Badge
            key={tagName}
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
            onClick={() => onTagClick(tagName)}
          >
            {tagName}
          </Badge>
        ))}
      </div>
    </div>
  );
}
