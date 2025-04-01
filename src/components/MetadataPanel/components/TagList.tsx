
import React from 'react';
import { Tag } from '@/types/tag';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TagListProps {
  tags: Tag[];
  editable: boolean;
  onDeleteTag?: (tagId: string) => Promise<void>;
  onReorderTags?: (tags: Tag[]) => Promise<void>;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  editable,
  onDeleteTag,
  onReorderTags
}) => {
  // Sort tags by display order
  const sortedTags = React.useMemo(() => {
    return [...tags].sort((a, b) => {
      const orderA = a.display_order ?? 0;
      const orderB = b.display_order ?? 0;
      return orderA - orderB;
    });
  }, [tags]);

  // For drag and drop reordering
  const [draggedTag, setDraggedTag] = React.useState<Tag | null>(null);

  // Handle drag start
  const handleDragStart = (tag: Tag) => {
    if (!editable || !onReorderTags) return;
    setDraggedTag(tag);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, tag: Tag) => {
    if (!editable || !draggedTag || !onReorderTags) return;
    e.preventDefault();
  };

  // Handle drop to reorder
  const handleDrop = (e: React.DragEvent, targetTag: Tag) => {
    if (!editable || !draggedTag || !onReorderTags) return;
    e.preventDefault();

    // Skip if dropping on itself
    if (draggedTag.id === targetTag.id) {
      setDraggedTag(null);
      return;
    }

    // Create new array with updated order
    const updatedTags = [...sortedTags];
    const fromIndex = updatedTags.findIndex(t => t.id === draggedTag.id);
    const toIndex = updatedTags.findIndex(t => t.id === targetTag.id);

    // Remove from original position
    const [removedTag] = updatedTags.splice(fromIndex, 1);
    // Insert at new position
    updatedTags.splice(toIndex, 0, removedTag);

    // Update display_order for all tags
    const reorderedTags = updatedTags.map((tag, index) => ({
      ...tag,
      display_order: index
    }));

    // Save the new order
    onReorderTags(reorderedTags);
    setDraggedTag(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedTag(null);
  };

  // Empty state
  if (sortedTags.length === 0) {
    return <div className="text-sm text-muted-foreground">No tags yet</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sortedTags.map(tag => (
        <Badge
          key={tag.id}
          variant="outline"
          className={`
            flex items-center gap-1 cursor-default
            ${editable && onReorderTags ? 'cursor-move' : ''}
            ${draggedTag?.id === tag.id ? 'opacity-50' : ''}
          `}
          draggable={editable && !!onReorderTags}
          onDragStart={() => handleDragStart(tag)}
          onDragOver={(e) => handleDragOver(e, tag)}
          onDrop={(e) => handleDrop(e, tag)}
          onDragEnd={handleDragEnd}
        >
          {tag.name}
          {editable && onDeleteTag && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-muted"
              onClick={() => onDeleteTag(tag.id)}
              aria-label={`Remove tag ${tag.name}`}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Badge>
      ))}
    </div>
  );
};
