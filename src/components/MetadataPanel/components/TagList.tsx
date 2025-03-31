
import React from 'react';
import { Tag as TagType } from '@/types/tag';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DraggableTagList } from './DraggableTagList';

export interface TagListProps {
  tags: TagType[];
  editable: boolean;
  onDeleteTag: (tagId: string) => Promise<void>;
  onReorderTags?: (tags: TagType[]) => void;
  showTypeLabels?: boolean;
}

// Individual Tag component (internal use)
const Tag = ({ 
  tag, 
  onDelete, 
  editable 
}: { 
  tag: TagType; 
  onDelete: (id: string) => Promise<void>; 
  editable: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: tag.id,
    disabled: !editable
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="inline-flex items-center mr-2 mb-2"
    >
      <Badge 
        variant="secondary" 
        className="pr-1 max-w-xs truncate group"
      >
        <span className="truncate max-w-[180px]">{tag.name}</span>
        {editable && (
          <Button
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 ml-1 opacity-70 hover:opacity-100"
            onClick={() => onDelete(tag.id)}
            aria-label={`Remove ${tag.name} tag`}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </Badge>
    </div>
  );
};

export const TagList: React.FC<TagListProps> = ({ 
  tags, 
  editable, 
  onDeleteTag,
  onReorderTags = undefined,
  showTypeLabels = false 
}) => {
  if (tags.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No tags
      </div>
    );
  }

  if (editable && onReorderTags) {
    return (
      <DraggableTagList 
        tags={tags} 
        onDeleteTag={onDeleteTag} 
        onReorderTags={onReorderTags} 
        showTypeLabels={showTypeLabels}
      />
    );
  }

  return (
    <div className="flex flex-wrap">
      {tags.map((tag) => (
        <Tag 
          key={tag.id} 
          tag={tag} 
          onDelete={onDeleteTag} 
          editable={editable} 
        />
      ))}
    </div>
  );
};
