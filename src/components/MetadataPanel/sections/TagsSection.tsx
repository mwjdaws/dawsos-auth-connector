
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, Loader2Icon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTagReordering } from '../hooks/useTagReordering';
import { Tag, TagPosition } from '@/utils/validation/types';

interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
  onDeleteTag: (tagId: string) => void;
  onMetadataChange?: () => void;
  className?: string;
}

export const TagsSection = ({
  tags,
  contentId,
  editable,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  onMetadataChange,
  className
}: TagsSectionProps) => {
  // Set up tag reordering if needed
  const { handleReorderTags, isReordering } = useTagReordering({
    contentId,
    onMetadataChange
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      onAddTag();
    }
  };

  const onReorderTags = async (reorderedTags: TagPosition[]) => {
    await handleReorderTags(reorderedTags);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Tags</h3>
        {isReordering && (
          <div className="text-xs text-muted-foreground flex items-center">
            <Spinner size="xs" className="mr-1" />
            Reordering...
          </div>
        )}
      </div>

      {editable && (
        <div className="flex space-x-2">
          <Input
            placeholder="Add a tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow"
          />
          <Button
            onClick={onAddTag}
            size="sm"
            variant="outline"
            disabled={!newTag.trim()}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      )}

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 py-1">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1 py-1 px-2.5"
            >
              {tag.name}
              {editable && (
                <button
                  onClick={() => onDeleteTag(tag.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground italic py-1">
          No tags have been added yet.
        </div>
      )}
    </div>
  );
};
