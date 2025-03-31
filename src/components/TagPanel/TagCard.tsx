
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TagCardProps {
  title: string;
  tags: string[];
  onTagClick: (tag: string) => void;
}

export function TagCard({ title, tags, onTagClick }: TagCardProps) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
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
