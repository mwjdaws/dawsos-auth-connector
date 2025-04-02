
import React from 'react';
import { X } from 'lucide-react';
import { Tag } from '@/types/tag';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TagItemProps {
  tag: Tag;
  editable?: boolean;
  onTagClick?: ((tag: Tag) => void) | undefined;
  onTagDelete?: ((tagId: string) => void) | undefined;
  className?: string;
}

export function TagItem({
  tag,
  editable = false,
  onTagClick,
  onTagDelete,
  className
}: TagItemProps) {
  // Handle tag click event
  const handleTagClick = () => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  // Handle tag delete event
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTagDelete) {
      onTagDelete(tag.id);
    }
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        "cursor-pointer hover:bg-secondary/80 transition-colors",
        onTagClick ? "cursor-pointer" : "cursor-default",
        className
      )}
      onClick={onTagClick ? handleTagClick : undefined}
    >
      {tag.name}
      {editable && onTagDelete && (
        <X
          className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground"
          onClick={handleDeleteClick}
        />
      )}
    </Badge>
  );
}

export default TagItem;
